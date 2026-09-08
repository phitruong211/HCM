"use client";

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

  return (
    <div className="event-popup-overlay">
      <div className="event-popup-card">
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
  );
}
