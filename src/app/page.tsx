"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { events, getEventsByMarker, type HistoricalEvent } from "@/data/events";

import HeroOverlay from "@/components/HeroOverlay";
import Timeline from "@/components/Timeline";
import EventPopup from "@/components/EventPopup";
import ValuesModal from "@/components/ValuesModal";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);
  const [showValuesModal, setShowValuesModal] = useState(false);

  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playIndexRef = useRef(0);

  // Navigate to event with cinematic transition
  const navigateToEvent = useCallback(
    (event: HistoricalEvent, isFirstEvent = false) => {
      if (isTransitioning) return;
      setShowPopup(false);
      setPrevEvent(isFirstEvent ? null : activeEvent);
      setActiveEvent(event);
      setIsTransitioning(true);
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
      setIsPlaying(false);
      navigateToEvent(events[0], true);
    }, 500);
  }, [navigateToEvent]);

  const handleEventClick = useCallback(
    (event: HistoricalEvent) => {
      setIsPlaying(false);
      navigateToEvent(event);
    },
    [navigateToEvent]
  );

  const handleMarkerClick = useCallback(
    (markerId: string) => {
      setIsPlaying(false);
      const markerEvents = getEventsByMarker(markerId);
      if (markerEvents.length > 0) {
        navigateToEvent(markerEvents[0]);
      }
    },
    [navigateToEvent]
  );

  const handleSelectEvent = useCallback(
    (event: HistoricalEvent) => {
      setIsPlaying(false);
      setShowPopup(false);
      setPrevEvent(activeEvent);
      setActiveEvent(event);
      setTimeout(() => {
        setShowPopup(true);
      }, 100);
    },
    [activeEvent]
  );

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
    setIsPlaying(false);
  }, []);

  const handleNextEvent = useCallback(() => {
    const currentIndex = events.findIndex((e) => e.id === activeEvent?.id);
    if (currentIndex < events.length - 1) {
      navigateToEvent(events[currentIndex + 1]);
    } else {
      setIsPlaying(false);
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
        setIsPlaying(false);
        handleNextEvent();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsPlaying(false);
        handlePrevEvent();
      } else if (e.key === "Escape") {
        setShowPopup(false);
        setIsPlaying(false);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHero, isTransitioning, handleNextEvent, handlePrevEvent]);

  // Auto-play logic: when transition is done, wait 5 seconds then go to next
  useEffect(() => {
    if (isPlaying && !isTransitioning && activeEvent) {
      const timer = setTimeout(() => {
        handleNextEvent();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isTransitioning, activeEvent, handleNextEvent]);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev) {
        // Start from beginning
        navigateToEvent(events[0], true);
        return true;
      }
      return false;
    });
  }, [navigateToEvent]);

  return (
    <div className="app-container">
      {/* Floating Button for Values Modal */}
      {!showHero && (
        <button
          onClick={() => setShowValuesModal(true)}
          className="values-modal-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Giá Trị Tư Tưởng
        </button>
      )}

      <ValuesModal 
        isOpen={showValuesModal} 
        onClose={() => setShowValuesModal(false)} 
      />

      {/* Map */}
      <MapView
        activeEvent={activeEvent}
        prevEvent={prevEvent}
        isPlaying={isPlaying}
        onMarkerClick={handleMarkerClick}
        onTransitionDone={handleTransitionDone}
      />

      {/* Hero */}
      {showHero && <HeroOverlay onStart={handleHeroStart} />}

      {/* Timeline */}
      {!showHero && (
        <Timeline
          activeEventId={activeEvent?.id || null}
          isPlaying={isPlaying}
          onEventClick={handleEventClick}
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
          onSelectEvent={handleSelectEvent}
        />
      )}
    </div>
  );
}
