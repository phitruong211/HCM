"use client";

import { useState, useRef, useEffect } from "react";
import type { HistoricalEvent } from "@/data/events";
import { events } from "@/data/events";

interface EventPopupProps {
  event: HistoricalEvent;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function EventPopup({
  event,
  onClose,
  onNext,
  onPrev,
}: EventPopupProps) {
  const currentIndex = events.findIndex((e) => e.id === event.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === events.length - 1;

  const isVideo = event.mediaType === "video";

  // Video overlay state for period 5
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [videoSkipped, setVideoSkipped] = useState(false);
  const videoOverlayRef = useRef<HTMLVideoElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);

  // Auto-show video overlay when a period 5 event first appears
  useEffect(() => {
    if (isVideo) {
      setShowVideoOverlay(true);
      setVideoSkipped(false);
    } else {
      setShowVideoOverlay(false);
      setVideoSkipped(false);
    }
  }, [event.id, isVideo]);

  const handleVideoEnd = () => {
    setShowVideoOverlay(false);
    setVideoSkipped(true);
  };

  const handleSkipVideo = () => {
    if (videoOverlayRef.current) {
      videoOverlayRef.current.pause();
    }
    setShowVideoOverlay(false);
    setVideoSkipped(true);
  };

  return (
    <>
      {/* Main popup card */}
      <div className="event-popup-overlay">
        <div className="event-popup-card">
          {/* Media section — image or thumbnail video */}
          <div className="event-popup-media">
            {isVideo ? (
              <video
                ref={thumbnailVideoRef}
                src={event.media}
                className="event-popup-media-video"
                muted
                loop
                autoPlay
                playsInline
                onClick={() => {
                  setShowVideoOverlay(true);
                  setVideoSkipped(false);
                }}
              />
            ) : (
              <img
                src={event.media}
                alt={event.title}
                className="event-popup-media-img"
              />
            )}
            {isVideo && (
              <button
                className="event-popup-play-btn"
                onClick={() => {
                  setShowVideoOverlay(true);
                  setVideoSkipped(false);
                }}
                title="Xem video"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
            )}
          </div>

          {/* Header */}
          <div className="event-popup-header">
            <button className="event-popup-close" onClick={onClose}>
              ✕
            </button>

            <div
              className="event-popup-period"
              style={{ color: event.periodColor }}
            >
              <span
                className="event-popup-period-dot"
                style={{ backgroundColor: event.periodColor }}
              />
              {event.periodName}
            </div>

            <div className="event-popup-year">
              {event.year}
              {event.month ? `.${String(event.month).padStart(2, "0")}` : ""}
            </div>

            <h2 className="event-popup-title">{event.title}</h2>
          </div>

          {/* Body */}
          <div className="event-popup-body">
            <div className="event-popup-location">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </div>
            <p className="event-popup-description">{event.description}</p>
          </div>

          {/* Footer */}
          <div className="event-popup-footer">
            <button
              className="event-popup-nav-btn"
              onClick={onPrev}
              disabled={isFirst}
            >
              ← Trước
            </button>

            <span className="event-popup-counter">
              {currentIndex + 1} / {events.length}
            </span>

            <button
              className="event-popup-nav-btn"
              onClick={onNext}
              disabled={isLast}
            >
              Tiếp →
            </button>
          </div>
        </div>
      </div>

      {/* Video overlay for period 5 — large centered player */}
      {isVideo && showVideoOverlay && (
        <div className="video-overlay">
          <div className="video-overlay-backdrop" onClick={handleSkipVideo} />
          <div className="video-overlay-container">
            <video
              ref={videoOverlayRef}
              src={event.media}
              className="video-overlay-player"
              autoPlay
              playsInline
              controls
              onEnded={handleVideoEnd}
            />
            <button className="video-overlay-skip" onClick={handleSkipVideo}>
              Bỏ qua ✕
            </button>
            <div className="video-overlay-title">{event.title}</div>
          </div>
        </div>
      )}
    </>
  );
}
