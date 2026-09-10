"use client";

import { useState } from "react";
import { events, markers, periods, type HistoricalEvent } from "@/data/events";
import { renderFormattedText } from "@/utils/textFormatting";

interface TimelineProps {
  activeEventId: string | null;
  isPlaying: boolean;
  onEventClick: (event: HistoricalEvent) => void;
  onPlayToggle: () => void;
  onRestart: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activePeriodId: number;
  onPeriodChange: (id: number) => void;
}

export default function Timeline({
  activeEventId,
  isPlaying,
  onEventClick,
  onPlayToggle,
  onRestart,
  collapsed,
  onToggleCollapse,
  activePeriodId,
  onPeriodChange,
}: TimelineProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const activePeriod = periods.find((p) => p.id === activePeriodId);
  const visibleEvents = events.filter((e) => e.thoiKy === activePeriodId);

  const handleEventClick = (event: HistoricalEvent) => {
    // Toggle expand state if clicking the same event, otherwise expand it
    setExpandedEventId((prev) => (prev === event.id ? null : event.id));
    onEventClick(event);
  };

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

      <div className="play-controls" style={{ display: 'flex', gap: '8px' }}>
        <button
          className={`play-button ${isPlaying ? "playing" : ""}`}
          onClick={onPlayToggle}
          style={{ flex: 1 }}
        >
          {isPlaying ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Tạm dừng
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              {activeEventId && activeEventId !== events[0].id ? "Tiếp tục" : "Bắt đầu"}
            </>
          )}
        </button>
        {activeEventId && activeEventId !== events[0].id && (
          <button
            className="play-button"
            onClick={onRestart}
            style={{ width: '40px', flex: 'none', padding: '10px 0' }}
            title="Bắt đầu lại"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>

      {/* TABS FOR PERIODS */}
      <div className="timeline-tabs">
        {periods.map((p) => (
          <button
            key={p.id}
            className={`timeline-tab ${activePeriodId === p.id ? "active" : ""}`}
            onClick={() => onPeriodChange(p.id)}
            title={p.range}
          >
            {p.name.replace("Thời kỳ ", "TK")}
          </button>
        ))}
      </div>

      {/* ACTIVE PERIOD SUMMARY */}
      {activePeriod && (
        <div className="period-summary">
          <div className="period-summary-range">{activePeriod.range}</div>
          <div className="period-summary-text">{activePeriod.summary}</div>
        </div>
      )}

      {/* EVENTS LIST */}
      <div className="timeline-events">
        {visibleEvents.map((event) => {
          const marker = markers.find((m) => m.id === event.markerId);
          const isExpanded = expandedEventId === event.id;
          const isActive = activeEventId === event.id;

          return (
            <div
              key={event.id}
              className={`timeline-event-item ${isActive ? "active" : ""} ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <span className={`timeline-event-marker ${isActive ? "active" : ""}`} />
              
              <div className="timeline-event-content">
                {/* Header (Always visible) */}
                <div 
                  className="timeline-event-header"
                  onClick={() => handleEventClick(event)}
                >
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
