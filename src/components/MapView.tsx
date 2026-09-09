"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import type { HistoricalEvent } from "@/data/events";
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
  filteredEvents: HistoricalEvent[];
  onMarkerClick: (event: HistoricalEvent) => void;
  onTransitionDone: () => void;
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
  filteredEvents,
  onMarkerClick,
  onTransitionDone,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const mapLoadedRef = useRef(false);
  const animatingRef = useRef(false);
  // Track all route coordinates drawn so far
  const routeCoordsRef = useRef<[number, number][]>([]);

  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11");

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

    map.on("style.load", () => {
      mapLoadedRef.current = true;
      if (!map.getSource("route-line")) {
        addIslandLayers(map);
        addRouteLine(map);
        
        // Restore route/highlight data
        if (routeCoordsRef.current.length > 0) {
          const src = map.getSource("route-line") as mapboxgl.GeoJSONSource;
          if (src) src.setData(makeLineGeoJSON(routeCoordsRef.current));
        }
      }
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
      mapLoadedRef.current = false;
    };
  }, []); // Only run once on mount

  // ════════════════════════════════════════════
  // CHANGE MAP STYLE
  // ════════════════════════════════════════════
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

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

    const showIslandPopup = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
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
  // UPDATE MARKERS
  // ════════════════════════════════════════════
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    filteredEvents.forEach((event) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.backgroundColor = event.periodColor;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick(event);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(event.coordinates)
        .addTo(map);
      markersRef.current.set(event.id, marker);
    });
  }, [filteredEvents, onMarkerClick]);

  // Update active marker style
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === activeEvent?.id) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }, [activeEvent]);

  // ════════════════════════════════════════════
  // CINEMATIC TRANSITION — Smooth multi-step animation
  // ════════════════════════════════════════════
  //
  // Sequence (with 3D pitch for drama):
  // 1. Tilt up + zoom out (cinematic pull-back)
  // 2. Fly to new location (fast, tilted)
  // 3. Draw route line mid-flight
  // 4. Swoop down + zoom in (dramatic landing)
  //
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeEvent || !mapLoadedRef.current) return;
    if (animatingRef.current) return;

    animatingRef.current = true;
    const hasPrev = prevEvent && prevEvent.id !== activeEvent.id;

    if (!hasPrev) {
      // ── First event — cinematic intro swoop ──
      map.flyTo({
        center: activeEvent.coordinates,
        zoom: 11,
        pitch: 0,
        bearing: 0,
        duration: 2200,
        essential: true,
        curve: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
      map.once("moveend", () => {
        routeCoordsRef.current = [activeEvent.coordinates];
        const src = map.getSource("route-line") as mapboxgl.GeoJSONSource;
        if (src) src.setData(makeLineGeoJSON([]));

        // Show territory highlight for first event
        updateTerritoryHighlight(activeEvent.coordinates, activeEvent.location);

        animatingRef.current = false;
        onTransitionDone();
      });
      return;
    }

    // ── Calculate distance-based parameters ──
    const dx = activeEvent.coordinates[0] - prevEvent.coordinates[0];
    const dy = activeEvent.coordinates[1] - prevEvent.coordinates[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    let zoomOut: number;
    let pullBackSpeed: number;
    let flySpeed: number;
    let swoopSpeed: number;

    if (dist < 1.5) {
      zoomOut = 8;
      pullBackSpeed = 800;
      flySpeed = 600;
      swoopSpeed = 900;
    } else if (dist < 5) {
      zoomOut = 6.5;
      pullBackSpeed = 1000;
      flySpeed = 800;
      swoopSpeed = 1000;
    } else if (dist < 15) {
      zoomOut = 5;
      pullBackSpeed = 1200;
      flySpeed = 900;
      swoopSpeed = 1100;
    } else if (dist < 50) {
      zoomOut = 3.8;
      pullBackSpeed = 1400;
      flySpeed = 1100;
      swoopSpeed = 1200;
    } else {
      zoomOut = 2.8;
      pullBackSpeed = 1600;
      flySpeed = 1300;
      swoopSpeed = 1300;
    }

    const bearingShift = dist > 5 ? (dx > 0 ? 12 : -12) : 0;

    const midLng = (prevEvent.coordinates[0] + activeEvent.coordinates[0]) / 2;
    const midLat = (prevEvent.coordinates[1] + activeEvent.coordinates[1]) / 2;

    // ── STEP 1: Clear old territory highlight + pull-back ──
    clearTerritoryHighlight();

    map.flyTo({
      center: [midLng, midLat],
      zoom: zoomOut,
      pitch: 45,
      bearing: bearingShift,
      duration: pullBackSpeed,
      essential: true,
      curve: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    map.once("moveend", () => {
      updateRouteLine(prevEvent.coordinates, activeEvent.coordinates);

      // ── STEP 2: Fast fly to target ──
      map.flyTo({
        center: activeEvent.coordinates,
        zoom: zoomOut + 1,
        pitch: 35,
        bearing: bearingShift * 0.5,
        duration: flySpeed,
        essential: true,
        curve: 1,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });

      map.once("moveend", () => {
        // ── STEP 3: Swoop down + show territory highlight ──
        map.flyTo({
          center: activeEvent.coordinates,
          zoom: 11,
          pitch: 0,
          bearing: 0,
          duration: swoopSpeed,
          essential: true,
          curve: 1.2,
          easing: (t: number) => t * (2 - t),
        });

        map.once("moveend", () => {
          // Draw territory circle + bold location name
          updateTerritoryHighlight(activeEvent.coordinates, activeEvent.location);

          animatingRef.current = false;
          onTransitionDone();
        });
      });
    });
  }, [activeEvent, prevEvent, onTransitionDone, updateRouteLine, updateTerritoryHighlight, clearTerritoryHighlight]);

  // Re-apply territory highlight when activeEvent changes or style reloads
  useEffect(() => {
    if (activeEvent && mapLoadedRef.current) {
      updateTerritoryHighlight(activeEvent.coordinates, activeEvent.location);
    }
  }, [activeEvent, mapStyle, updateTerritoryHighlight]);

  return (
    <div className="map-wrapper" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainerRef} className="map-container" />
      
      {/* Map Style Selector */}
      <div 
        style={{ 
          position: "absolute", 
          top: "16px", 
          right: "16px", 
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "'DIN Pro Medium', 'Arial', sans-serif",
          backdropFilter: "blur(4px)"
        }}
      >
        <label htmlFor="mapStyleSelect" style={{ fontSize: "14px", color: "#5a3e08", fontWeight: "bold" }}>
          Bản đồ:
        </label>
        <select 
          id="mapStyleSelect"
          value={mapStyle} 
          onChange={(e) => setMapStyle(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #c9a84c",
            background: "#fff",
            color: "#333",
            fontSize: "14px",
            outline: "none",
            cursor: "pointer"
          }}
        >
          <option value="mapbox://styles/mapbox/light-v11">Sáng (Mặc định)</option>
          <option value="mapbox://styles/mapbox/dark-v11">Tối</option>
          <option value="mapbox://styles/mapbox/satellite-streets-v12">Vệ tinh</option>
          <option value="mapbox://styles/mapbox/outdoors-v12">Địa hình</option>
          <option value="mapbox://styles/mapbox/streets-v12">Đường phố</option>
        </select>
      </div>
    </div>
  );
}
