"use client";

import { events, markers, type HistoricalEvent } from "@/data/events";

interface TimelineProps {
  activeEventId: string | null;
  isPlaying: boolean;
  onEventClick: (event: HistoricalEvent) => void;
  onPlayToggle: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Timeline({
  activeEventId,
  isPlaying,
  onEventClick,
  onPlayToggle,
  collapsed,
  onToggleCollapse,
}: TimelineProps) {
  return (
    <div className={`timeline-panel ${collapsed ? "collapsed" : ""}`}>
      <button
        className="timeline-toggle"
        onClick={onToggleCollapse}
        title={collapsed ? "Mở timeline" : "Đóng timeline"}
      >
        {collapsed ? "▶" : "◀"}
      </button>

      <div className="timeline-header">
        <div className="timeline-header-title">Dòng thời gian</div>
        <div className="timeline-header-subtitle">
          Hành trình tư tưởng Hồ Chí Minh
        </div>
      </div>

      <div className="play-controls">
        <button
          className={`play-button ${isPlaying ? "playing" : ""}`}
          onClick={onPlayToggle}
        >
          {isPlaying ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Tạm dừng
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Bắt đầu hành trình
            </>
          )}
        </button>
      </div>

      <div className="timeline-events">
        {events.map((event) => {
          const marker = markers.find((m) => m.id === event.markerId);
          return (
            <div
              key={event.id}
              className={`timeline-event-item ${
                activeEventId === event.id ? "active" : ""
              }`}
              onClick={() => onEventClick(event)}
            >
              <span
                className={`timeline-event-marker ${
                  activeEventId === event.id ? "active" : ""
                }`}
              />
              <div className="timeline-event-info">
                <div className="timeline-event-year">{event.yearLabel}</div>
                <div className="timeline-event-title">{event.title}</div>
                {marker && (
                  <div className="timeline-event-location">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {marker.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
