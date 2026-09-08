"use client";

import { events, periods, type HistoricalEvent } from "@/data/events";
import PeriodFilter from "./PeriodFilter";

interface TimelineProps {
  activeEventId: string | null;
  activePeriods: number[];
  isPlaying: boolean;
  onEventClick: (event: HistoricalEvent) => void;
  onTogglePeriod: (periodId: number) => void;
  onPlayToggle: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Timeline({
  activeEventId,
  activePeriods,
  isPlaying,
  onEventClick,
  onTogglePeriod,
  onPlayToggle,
  collapsed,
  onToggleCollapse,
}: TimelineProps) {
  const filteredEvents = events.filter((e) => activePeriods.includes(e.period));
  const groupedByPeriod = periods
    .filter((p) => activePeriods.includes(p.id))
    .map((period) => ({
      period,
      events: filteredEvents.filter((e) => e.period === period.id),
    }))
    .filter((g) => g.events.length > 0);

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
          Các sự kiện lịch sử quan trọng
        </div>
      </div>

      <PeriodFilter
        activePeriods={activePeriods}
        onTogglePeriod={onTogglePeriod}
      />

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
        {groupedByPeriod.map(({ period, events: periodEvents }) => (
          <div key={period.id} className="timeline-period-group">
            <div className="timeline-period-header">
              <div
                className="timeline-period-label"
                style={{ color: period.color }}
              >
                <span
                  className="timeline-period-dot"
                  style={{ backgroundColor: period.color }}
                />
                {period.name}
              </div>
              <div className="timeline-period-range">{period.timeRange}</div>
            </div>

            {periodEvents.map((event) => (
              <div
                key={event.id}
                className={`timeline-event-item ${
                  activeEventId === event.id ? "active" : ""
                }`}
                onClick={() => onEventClick(event)}
              >
                <span
                  className="timeline-event-marker"
                  style={
                    activeEventId === event.id
                      ? {
                          borderColor: event.periodColor,
                          backgroundColor: event.periodColor,
                        }
                      : {}
                  }
                />
                <div className="timeline-event-info">
                  <div className="timeline-event-year">
                    {event.year}
                    {event.month ? ` / ${String(event.month).padStart(2, "0")}` : ""}
                  </div>
                  <div className="timeline-event-title">{event.title}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
