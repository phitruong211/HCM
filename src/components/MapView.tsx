"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

import type { HistoricalEvent } from "@/data/events";
import { markers, getMarkerForEvent, getEventsByMarker } from "@/data/events";
import {
  largeIslandsGeoJSON,
  mediumIslandsGeoJSON,
  smallIslandsGeoJSON,
  islandLabelsGeoJSON,
  islandGroupLabelsGeoJSON,
  hoangSaBoundaryCollection,
  truongSaBoundaryCollection,
} from "@/data/islands";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapViewProps {
  activeEvent: HistoricalEvent | null;
  prevEvent: HistoricalEvent | null;
  isPlaying: boolean;
  onMarkerClick: (markerId: string) => void;
  onTransitionDone: () => void;
  activePeriodId: number;
}

// Route line source data helper
function makeLineGeoJSON(coords: [number, number][]) {
  return {
    type: "FeatureCollection" as const,
    features:
      coords.length >= 2
        ? [
            {
              type: "Feature" as const,
              properties: {},
              geometry: {
                type: "LineString" as const,
                coordinates: coords,
              },
            },
          ]
        : [],
  };
}

// Generate a circle polygon around a point (for territory highlight)
function makeCirclePolygon(
  center: [number, number],
  radiusKm: number,
  points = 64
) {
  const coords: [number, number][] = [];
  const earthRadius = 6371; // km
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dLat = (radiusKm / earthRadius) * (180 / Math.PI);
    const dLng =
      dLat / Math.cos((center[1] * Math.PI) / 180);
    coords.push([
      center[0] + dLng * Math.cos(angle),
      center[1] + dLat * Math.sin(angle),
    ]);
  }
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: { type: "Polygon" as const, coordinates: [coords] },
      },
    ],
  };
}

// Empty point for label
function makeLabelGeoJSON(
  center?: [number, number],
  label?: string
) {
  if (!center || !label) {
    return { type: "FeatureCollection" as const, features: [] };
  }
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: { name: label },
        geometry: { type: "Point" as const, coordinates: center },
      },
    ],
  };
}

// Empty polygon
function emptyPolygonGeoJSON() {
  return { type: "FeatureCollection" as const, features: [] };
}

export default function MapView({
  activeEvent,
  prevEvent,
  isPlaying,
  onMarkerClick,
  onTransitionDone,
  activePeriodId,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const mapLoadedRef = useRef(false);
  const animatingRef = useRef(false);
  // Track all route coordinates drawn so far
  const routeCoordsRef = useRef<[number, number][]>([]);

  // ════════════════════════════════════════════
  // INIT MAP
  // ════════════════════════════════════════════
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [106.0, 16.0],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 16,
      attributionControl: false,
      antialias: true,
    });

    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      "bottom-right"
    );

    map.on("load", () => {
      mapLoadedRef.current = true;
      addIslandLayers(map);
      addRouteLine(map);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
      mapLoadedRef.current = false;
    };
  }, []);

  const getMapPadding = useCallback(() => {
    if (typeof window === "undefined") return { left: 0, right: 0, top: 0, bottom: 0 };
    const w = window.innerWidth;
    if (w > 1500) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }
    return { 
      left: Math.min(420, w * 0.3), 
      right: Math.min(504, w * 0.3), 
      top: 0, 
      bottom: 0 
    };
  }, []);

  // ════════════════════════════════════════════
  // ROUTE LINE + TERRITORY HIGHLIGHT
  // ════════════════════════════════════════════
  const addRouteLine = useCallback((map: mapboxgl.Map) => {
    // ── Route line ──
    map.addSource("route-line", {
      type: "geojson",
      data: makeLineGeoJSON([]),
    });

    map.addLayer({
      id: "route-line-glow",
      type: "line",
      source: "route-line",
      paint: {
        "line-color": "#c9a84c",
        "line-width": 6,
        "line-opacity": 0.15,
        "line-blur": 4,
      },
    });

    map.addLayer({
      id: "route-line-dash",
      type: "line",
      source: "route-line",
      paint: {
        "line-color": "#8b6914",
        "line-width": 2,
        "line-dasharray": [6, 4],
        "line-opacity": 0.7,
      },
    });

    // ── Territory highlight circle ──
    map.addSource("territory-highlight", {
      type: "geojson",
      data: emptyPolygonGeoJSON(),
    });

    // Subtle fill
    map.addLayer({
      id: "territory-fill",
      type: "fill",
      source: "territory-highlight",
      paint: {
        "fill-color": "#c9a84c",
        "fill-opacity": 0.06,
      },
    });

    // Dashed border
    map.addLayer({
      id: "territory-border",
      type: "line",
      source: "territory-highlight",
      paint: {
        "line-color": "#8b6914",
        "line-width": 2,
        "line-dasharray": [5, 3, 2, 3],
        "line-opacity": 0.6,
      },
    });

    // ── Territory location label ──
    map.addSource("territory-label", {
      type: "geojson",
      data: makeLabelGeoJSON(),
    });

    map.addLayer({
      id: "territory-label-text",
      type: "symbol",
      source: "territory-label",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
        "text-size": 16,
        "text-anchor": "center",
        "text-offset": [0, -3.5],
        "text-allow-overlap": true,
        "text-letter-spacing": 0.12,
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "#5a3e08",
        "text-halo-color": "rgba(255, 252, 235, 0.95)",
        "text-halo-width": 2.5,
      },
    });
  }, []);

  // Update route line data
  const updateRouteLine = useCallback(
    (from: [number, number], to: [number, number]) => {
      const map = mapRef.current;
      if (!map || !mapLoadedRef.current) return;

      if (routeCoordsRef.current.length === 0) {
        routeCoordsRef.current = [from, to];
      } else {
        routeCoordsRef.current.push(to);
      }

      const src = map.getSource("route-line") as mapboxgl.GeoJSONSource;
      if (src) {
        src.setData(makeLineGeoJSON(routeCoordsRef.current));
      }
    },
    []
  );

  // Update territory highlight circle + label
  const updateTerritoryHighlight = useCallback(
    (center: [number, number], locationName: string) => {
      const map = mapRef.current;
      if (!map || !mapLoadedRef.current) return;

      // Circle radius ~30km — visible at zoom 10-11
      const circleData = makeCirclePolygon(center, 30);
      const labelData = makeLabelGeoJSON(center, locationName);

      const highlightSrc = map.getSource("territory-highlight") as mapboxgl.GeoJSONSource;
      const labelSrc = map.getSource("territory-label") as mapboxgl.GeoJSONSource;

      if (highlightSrc) highlightSrc.setData(circleData);
      if (labelSrc) labelSrc.setData(labelData);
    },
    []
  );

  // Clear territory highlight (when zooming out)
  const clearTerritoryHighlight = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;

    const highlightSrc = map.getSource("territory-highlight") as mapboxgl.GeoJSONSource;
    const labelSrc = map.getSource("territory-label") as mapboxgl.GeoJSONSource;

    if (highlightSrc) highlightSrc.setData(emptyPolygonGeoJSON());
    if (labelSrc) labelSrc.setData(makeLabelGeoJSON());
  }, []);

  // ════════════════════════════════════════════
  // ISLAND LAYERS (unchanged)
  // ════════════════════════════════════════════
  const addIslandLayers = useCallback((map: mapboxgl.Map) => {
    // Hoàng Sa
    map.addSource("hoang-sa-boundary", { type: "geojson", data: hoangSaBoundaryCollection });
    map.addLayer({ id: "hoang-sa-fill", type: "fill", source: "hoang-sa-boundary", paint: { "fill-color": "#b8963a", "fill-opacity": 0.08 } });
    map.addLayer({ id: "hoang-sa-border-outer", type: "line", source: "hoang-sa-boundary", paint: { "line-color": "#8b6914", "line-width": 2, "line-dasharray": [6, 4], "line-opacity": 0.7 } });
    map.addLayer({ id: "hoang-sa-border-inner", type: "line", source: "hoang-sa-boundary", paint: { "line-color": "#c9a84c", "line-width": 1, "line-dasharray": [3, 5], "line-opacity": 0.4, "line-offset": -3 } });

    // Trường Sa
    map.addSource("truong-sa-boundary", { type: "geojson", data: truongSaBoundaryCollection });
    map.addLayer({ id: "truong-sa-fill", type: "fill", source: "truong-sa-boundary", paint: { "fill-color": "#b8963a", "fill-opacity": 0.08 } });
    map.addLayer({ id: "truong-sa-border-outer", type: "line", source: "truong-sa-boundary", paint: { "line-color": "#8b6914", "line-width": 2, "line-dasharray": [6, 4], "line-opacity": 0.7 } });
    map.addLayer({ id: "truong-sa-border-inner", type: "line", source: "truong-sa-boundary", paint: { "line-color": "#c9a84c", "line-width": 1, "line-dasharray": [3, 5], "line-opacity": 0.4, "line-offset": -3 } });

    // Đảo lớn
    map.addSource("islands-large", { type: "geojson", data: largeIslandsGeoJSON });
    map.addLayer({ id: "islands-large-glow", type: "circle", source: "islands-large", paint: { "circle-radius": 12, "circle-color": "#c9a84c", "circle-opacity": 0.15, "circle-blur": 0.8 } });
    map.addLayer({ id: "islands-large-points", type: "circle", source: "islands-large", paint: { "circle-radius": 6, "circle-color": "#d4a847", "circle-stroke-width": 2.5, "circle-stroke-color": "#8b6914", "circle-opacity": 1 } });
    map.addLayer({ id: "islands-large-labels", type: "symbol", source: "islands-large", layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"], "text-size": 11, "text-anchor": "left", "text-offset": [1, 0], "text-allow-overlap": false, "text-optional": true }, paint: { "text-color": "#6b5215", "text-halo-color": "rgba(255, 255, 250, 0.9)", "text-halo-width": 1.5 } });

    // Đảo vừa
    map.addSource("islands-medium", { type: "geojson", data: mediumIslandsGeoJSON });
    map.addLayer({ id: "islands-medium-points", type: "circle", source: "islands-medium", minzoom: 4, paint: { "circle-radius": 4.5, "circle-color": "#c9a84c", "circle-stroke-width": 1.5, "circle-stroke-color": "#8b6914", "circle-opacity": 0.9 } });
    map.addLayer({ id: "islands-medium-labels", type: "symbol", source: "islands-medium", minzoom: 6, layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"], "text-size": 10, "text-anchor": "left", "text-offset": [0.8, 0], "text-allow-overlap": false, "text-optional": true }, paint: { "text-color": "#7a6530", "text-halo-color": "rgba(255, 255, 250, 0.85)", "text-halo-width": 1.2 } });

    // Đảo nhỏ
    map.addSource("islands-small", { type: "geojson", data: smallIslandsGeoJSON });
    map.addLayer({ id: "islands-small-points", type: "circle", source: "islands-small", minzoom: 5, paint: { "circle-radius": 3, "circle-color": "#b89840", "circle-stroke-width": 1, "circle-stroke-color": "#8b6914", "circle-opacity": 0.7 } });
    map.addLayer({ id: "islands-small-labels", type: "symbol", source: "islands-small", minzoom: 8, layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"], "text-size": 9, "text-anchor": "left", "text-offset": [0.7, 0], "text-allow-overlap": false, "text-optional": true }, paint: { "text-color": "#8a7645", "text-halo-color": "rgba(255, 255, 250, 0.8)", "text-halo-width": 1 } });

    // Nhãn chính
    map.addSource("island-labels-main", { type: "geojson", data: islandLabelsGeoJSON });
    map.addLayer({ id: "island-main-names", type: "symbol", source: "island-labels-main", layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"], "text-size": ["interpolate", ["linear"], ["zoom"], 3, 11, 6, 15, 9, 18], "text-anchor": "center", "text-offset": [0, -0.6], "text-allow-overlap": true, "text-letter-spacing": 0.15 }, paint: { "text-color": "#6b4e0a", "text-halo-color": "rgba(255, 255, 245, 0.92)", "text-halo-width": 2 } });
    map.addLayer({ id: "island-main-subtitle", type: "symbol", source: "island-labels-main", layout: { "text-field": ["get", "subtitle"], "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"], "text-size": ["interpolate", ["linear"], ["zoom"], 3, 9, 6, 12, 9, 14], "text-anchor": "center", "text-offset": [0, 0.6], "text-allow-overlap": true }, paint: { "text-color": "#8b6914", "text-halo-color": "rgba(255, 255, 245, 0.85)", "text-halo-width": 1.5 } });

    // Nhãn nhóm
    map.addSource("island-group-labels", { type: "geojson", data: islandGroupLabelsGeoJSON });
    map.addLayer({ id: "island-group-names", type: "symbol", source: "island-group-labels", minzoom: 6, layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"], "text-size": 10, "text-anchor": "center", "text-allow-overlap": false, "text-letter-spacing": 0.08 }, paint: { "text-color": "#9c7a30", "text-halo-color": "rgba(255, 255, 250, 0.8)", "text-halo-width": 1 } });

    // Hover popup
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, className: "island-popup", offset: 12 });

    const showIslandPopup = (e: mapboxgl.MapMouseEvent & { features?: any[] }) => {
      if (!e.features || e.features.length === 0) return;
      map.getCanvas().style.cursor = "pointer";
      const props = e.features[0].properties;
      const coords = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
      popup.setLngLat(coords).setHTML(`<div style="font-family:'Segoe UI',system-ui,sans-serif;padding:4px 0;"><strong style="color:#6b4e0a;font-size:13px;">${props?.name || ""}</strong><br/><span style="color:#8b7a5a;font-size:11px;font-style:italic;">${props?.nameEn || ""}</span></div>`).addTo(map);
    };
    const hideIslandPopup = () => { map.getCanvas().style.cursor = ""; popup.remove(); };
    for (const layerId of ["islands-large-points", "islands-medium-points", "islands-small-points"]) {
      map.on("mouseenter", layerId, showIslandPopup);
      map.on("mouseleave", layerId, hideIslandPopup);
    }
  }, []);

  // ════════════════════════════════════════════
  // UPDATE MARKERS — 7 markers (one per location)
  // ════════════════════════════════════════════
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Only create markers once
    if (markersRef.current.size > 0) return;

    markers.forEach((markerData) => {
      const el = document.createElement("div");
      el.className = markerData.isRegionLevel ? "custom-marker region-level" : "custom-marker";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick(markerData.id);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(markerData.coordinates)
        .addTo(map);
      markersRef.current.set(markerData.id, marker);
    });
  }, [onMarkerClick]);

  // Update marker visibility based on activePeriodId
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;

    // We don't flyTo/fitBounds if isPlaying because it would interrupt the animation
    if (!isPlaying) {
      const visibleMarkers = markers.filter((m) =>
        getEventsByMarker(m.id).some((e) => e.thoiKy === activePeriodId)
      );

      if (visibleMarkers.length > 0) {
        if (visibleMarkers.length === 1) {
          map.flyTo({
            center: visibleMarkers[0].coordinates,
            zoom: 6,
            duration: 1200,
            padding: getMapPadding(),
          });
        } else {
          const bounds = new mapboxgl.LngLatBounds();
          visibleMarkers.forEach((m) => bounds.extend(m.coordinates));
          const currentPadding = getMapPadding();
          map.fitBounds(bounds, {
            padding: { 
              top: 60, 
              bottom: 60, 
              left: Math.max(380, currentPadding.left), 
              right: Math.max(60, currentPadding.right) 
            },
            duration: 1200,
            maxZoom: 7,
          });
        }
      }
    }

    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const hasEventInPeriod = getEventsByMarker(id).some(
        (e) => e.thoiKy === activePeriodId
      );
      if (hasEventInPeriod) {
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
      } else {
        el.style.opacity = "0.2";
        el.style.pointerEvents = "none";
      }
    });
  }, [activePeriodId, isPlaying]);

  // Update active marker style based on active event's marker
  useEffect(() => {
    const activeMarkerId = activeEvent
      ? getMarkerForEvent(activeEvent)?.id
      : null;

    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === activeMarkerId) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }, [activeEvent]);

  // Re-center active marker on window resize
  useEffect(() => {
    const handleResize = () => {
      const map = mapRef.current;
      if (!map || !mapLoadedRef.current || !activeEvent || animatingRef.current) return;
      const marker = getMarkerForEvent(activeEvent);
      if (marker) {
        map.easeTo({
          center: marker.coordinates,
          padding: getMapPadding(),
          duration: 300,
        });
      }
    };
    
    // Add debounce to resize listener
    let timeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeout);
    };
  }, [activeEvent, getMapPadding]);

  // Clear route line when not playing
  useEffect(() => {
    if (!isPlaying) {
      routeCoordsRef.current = [];
      const map = mapRef.current;
      if (map && mapLoadedRef.current) {
        const src = map.getSource("route-line") as mapboxgl.GeoJSONSource;
        if (src) src.setData(makeLineGeoJSON([]));
      }
    }
  }, [isPlaying]);

  // ════════════════════════════════════════════
  // LINE DRAWING ANIMATION — Hoạt ảnh vẽ tuyến đường
  // ════════════════════════════════════════════
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeEvent || !mapLoadedRef.current) return;
    if (animatingRef.current) return;

    const activeMarker = getMarkerForEvent(activeEvent);
    if (!activeMarker) return;

    const prevMarker = prevEvent ? getMarkerForEvent(prevEvent) : null;

    animatingRef.current = true;

    if (prevMarker && prevMarker.id === activeMarker.id) {
      updateTerritoryHighlight(activeMarker.coordinates, activeMarker.name);
      animatingRef.current = false;
      onTransitionDone();
      return;
    }

    if (!prevMarker) {
      // First event — fly in directly
      map.flyTo({
        center: activeMarker.coordinates,
        zoom: 11,
        pitch: 0,
        bearing: 0,
        duration: 2200,
        essential: true,
        curve: 1.8,
        padding: getMapPadding(),
      });
      map.once("moveend", () => {
        routeCoordsRef.current = [activeMarker.coordinates];
        const src = map.getSource("route-line") as mapboxgl.GeoJSONSource;
        if (src) src.setData(makeLineGeoJSON([]));

        updateTerritoryHighlight(activeMarker.coordinates, activeMarker.name);
        animatingRef.current = false;
        onTransitionDone();
      });
      return;
    }

    clearTerritoryHighlight();

    // ── Calculate Great Circle Arc ──
    const startPt = turf.point(prevMarker.coordinates);
    const endPt = turf.point(activeMarker.coordinates);
    let arcCoords: [number, number][] = [];
    try {
      const arc = turf.greatCircle(startPt, endPt);
      const arcLength = turf.length(arc as any);
      const numSteps = Math.max(120, Math.floor(arcLength / 15)); 
      for (let i = 0; i <= numSteps; i++) {
        const segment = turf.along(arc as any, (i * arcLength) / numSteps);
        arcCoords.push(segment.geometry.coordinates as [number, number]);
      }
    } catch (e) {
      arcCoords = [prevMarker.coordinates, activeMarker.coordinates];
    }
    const numSteps = arcCoords.length - 1;
    const baseCoords = [...routeCoordsRef.current];
    if (baseCoords.length === 0) {
      baseCoords.push(prevMarker.coordinates);
    }

    // Sequence Step 1: fitBounds to see both A and B
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(prevMarker.coordinates);
    bounds.extend(activeMarker.coordinates);

    const pad = getMapPadding();
    map.fitBounds(bounds, {
      padding: { 
        top: 100, 
        bottom: 100, 
        left: Math.max(100, pad.left + 50), 
        right: Math.max(100, pad.right + 50) 
      },
      duration: 1200,
      maxZoom: 9, // Prevent over-zooming on short distances
      essential: true,
    });

    map.once("moveend", () => {
      // Sequence Step 2: Draw the line
      const duration = isPlaying ? 3000 : 800; // 3s for auto-play, 0.8s for manual
      const startTime = performance.now();

      function animateLine(now: number) {
        const currentMap = mapRef.current;
        if (!currentMap || !activeMarker) return;

        const progress = Math.min((now - startTime) / duration, 1);
        const currentStep = Math.floor(progress * numSteps);

        if (progress >= 1) {
          // Finished drawing
          routeCoordsRef.current = [...baseCoords, ...arcCoords];
          const finalSrc = currentMap.getSource("route-line") as mapboxgl.GeoJSONSource;
          if (finalSrc) {
            finalSrc.setData(makeLineGeoJSON(routeCoordsRef.current));
          }
          
          // Sequence Step 3: Zoom in to target
          currentMap.flyTo({
            center: activeMarker.coordinates,
            zoom: 11,
            pitch: 0,
            bearing: 0,
            duration: 1200,
            essential: true,
            padding: getMapPadding(),
          });

          currentMap.once("moveend", () => {
            updateTerritoryHighlight(activeMarker.coordinates, activeMarker.name);
            animatingRef.current = false;
            onTransitionDone();
          });
          return;
        }

        // Update line source
        const currentLine = [...baseCoords, ...arcCoords.slice(0, currentStep + 1)];
        const src = currentMap.getSource("route-line") as mapboxgl.GeoJSONSource;
        if (src) {
          src.setData(makeLineGeoJSON(currentLine));
        }

        animationRef.current = requestAnimationFrame(animateLine);
      }

      animationRef.current = requestAnimationFrame(animateLine);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeEvent, prevEvent, isPlaying, getMapPadding, onTransitionDone, clearTerritoryHighlight, updateTerritoryHighlight]);

  return (
    <div className="map-wrapper">
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}
