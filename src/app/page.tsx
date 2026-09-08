"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { events, type HistoricalEvent } from "@/data/events";

import HeroOverlay from "@/components/HeroOverlay";
import Timeline from "@/components/Timeline";
import EventPopup from "@/components/EventPopup";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <span className="map-loading-text">Đang tải bản đồ...</span>
    </div>
  ),
});

export default function Home() {
  const [showHero, setShowHero] = useState(true);
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);
  const [prevEvent, setPrevEvent] = useState<HistoricalEvent | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activePeriods, setActivePeriods] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);

  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playIndexRef = useRef(0);

  const filteredEvents = events.filter((e) =>
    activePeriods.includes(e.period)
  );

  // Navigate to event with cinematic transition
  const navigateToEvent = useCallback(
    (event: HistoricalEvent, isFirstEvent = false) => {
      if (isTransitioning) return;
      setShowPopup(false);
      setPrevEvent(activeEvent);
      setActiveEvent(event);
      setIsTransitioning(true);

      if (isFirstEvent) {
        // First event: no zoom-out, just fly in directly
        // MapView will handle showing popup after fly-in
      }
      // MapView handles the full cinematic sequence and calls onTransitionDone
    },
    [activeEvent, isTransitioning]
  );

  const handleTransitionDone = useCallback(() => {
    setIsTransitioning(false);
    setShowPopup(true);
  }, []);

  const handleHeroStart = useCallback(() => {
    setShowHero(false);
    setTimeout(() => {
      if (events.length > 0) {
        navigateToEvent(events[0], true);
      }
    }, 500);
  }, [navigateToEvent]);

  const handleEventClick = useCallback(
    (event: HistoricalEvent) => {
      setIsPlaying(false);
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      navigateToEvent(event);
    },
    [navigateToEvent]
  );

  const handleMarkerClick = useCallback(
    (event: HistoricalEvent) => {
      setIsPlaying(false);
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      navigateToEvent(event);
    },
    [navigateToEvent]
  );

  const handleTogglePeriod = useCallback((periodId: number) => {
    setActivePeriods((prev) => {
      if (prev.includes(periodId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== periodId);
      }
      return [...prev, periodId].sort();
    });
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  const handleNextEvent = useCallback(() => {
    const currentIndex = events.findIndex((e) => e.id === activeEvent?.id);
    if (currentIndex < events.length - 1) {
      navigateToEvent(events[currentIndex + 1]);
    }
  }, [activeEvent, navigateToEvent]);

  const handlePrevEvent = useCallback(() => {
    const currentIndex = events.findIndex((e) => e.id === activeEvent?.id);
    if (currentIndex > 0) {
      navigateToEvent(events[currentIndex - 1]);
    }
  }, [activeEvent, navigateToEvent]);

  // Keyboard navigation: arrow keys
  useEffect(() => {
    if (showHero) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNextEvent();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevEvent();
      } else if (e.key === "Escape") {
        setShowPopup(false);
      } else if (e.key === " ") {
        e.preventDefault();
        handlePlayToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHero, isTransitioning, handleNextEvent, handlePrevEvent]);

  // Play/pause auto-tour
  const playNextEvent = useCallback(() => {
    const filtered = events.filter((e) => activePeriods.includes(e.period));
    if (playIndexRef.current >= filtered.length) {
      setIsPlaying(false);
      playIndexRef.current = 0;
      return;
    }
    navigateToEvent(filtered[playIndexRef.current]);
    playIndexRef.current += 1;

    // Wait for cinematic transition to complete before next event
    playTimeoutRef.current = setTimeout(() => {
      playNextEvent();
    }, 6000);
  }, [activePeriods, navigateToEvent]);

  const handlePlayToggle = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    } else {
      setIsPlaying(true);
      playIndexRef.current = 0;
      playNextEvent();
    }
  }, [isPlaying, playNextEvent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="app-container">
      {/* Map */}
      <MapView
        activeEvent={activeEvent}
        prevEvent={prevEvent}
        filteredEvents={filteredEvents}
        onMarkerClick={handleMarkerClick}
        onTransitionDone={handleTransitionDone}
      />

      {/* Hero */}
      {showHero && <HeroOverlay onStart={handleHeroStart} />}

      {/* Timeline */}
      {!showHero && (
        <Timeline
          activeEventId={activeEvent?.id || null}
          activePeriods={activePeriods}
          isPlaying={isPlaying}
          onEventClick={handleEventClick}
          onTogglePeriod={handleTogglePeriod}
          onPlayToggle={handlePlayToggle}
          collapsed={timelineCollapsed}
          onToggleCollapse={() => setTimelineCollapsed(!timelineCollapsed)}
        />
      )}

      {/* Event Popup — only show after cinematic transition completes */}
      {!showHero && activeEvent && showPopup && (
        <EventPopup
          event={activeEvent}
          onClose={handleClosePopup}
          onNext={handleNextEvent}
          onPrev={handlePrevEvent}
        />
      )}
    </div>
  );
}
