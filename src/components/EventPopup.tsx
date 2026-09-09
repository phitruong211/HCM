"use client";

import type { HistoricalEvent } from "@/data/events";
import { events, markers, getEventsByMarker } from "@/data/events";
import ReactMarkdown from "react-markdown";
import { X, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface EventPopupProps {
  event: HistoricalEvent;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectEvent: (event: HistoricalEvent) => void;
}

export default function EventPopup({
  event,
  onClose,
  onNext,
  onPrev,
  onSelectEvent,
}: EventPopupProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    setShowDetails(false);
  }, [event]);
  
  const currentIndex = events.findIndex((e) => e.id === event.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === events.length - 1;

  const marker = markers.find((m) => m.id === event.markerId);
  const markerEvents = getEventsByMarker(event.markerId);
  const hasMultipleEvents = markerEvents.length > 1;

  return (
    <>
      <div className="event-popup-overlay">
        <div className="event-popup-container">
          {/* Details Panel (left side of popup) */}
          {event.details && showDetails && (
            <div className="event-popup-details-panel">
              <ReactMarkdown>{event.details}</ReactMarkdown>
            </div>
          )}

          <div className="event-popup-card has-image">
          {/* Image Header */}
          {event.image && (
            <div className="event-popup-media" onClick={() => setIsLightboxOpen(true)}>
              <Image 
                src={event.image} 
                alt={event.title} 
                fill 
                className="event-popup-media-img"
              />
              <div className="event-popup-media-overlay">
                <Maximize2 size={24} className="event-popup-expand-icon" />
              </div>
            </div>
          )}

          {/* Header */}
          <div className="event-popup-header">
            <button className="event-popup-close" onClick={onClose}>
              <X size={18} />
            </button>

            {marker && (
              <div className="event-popup-marker-name">
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
                {marker.name}
              </div>
            )}

            <div className="event-popup-year">{event.yearLabel}</div>
            <h2 className="event-popup-title">{event.title}</h2>
          </div>

          {/* Body */}
          <div className="event-popup-body">
            <p className="event-popup-description">{event.description}</p>
            {event.details && (
              <button 
                className="btn-read-more"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>

          {/* Marker events list — when marker has multiple events */}
          {hasMultipleEvents && (
            <div className="event-popup-marker-events">
              <div className="event-popup-marker-events-label">
                Các sự kiện tại {marker?.name}
              </div>
              {markerEvents.map((me) => (
                <button
                  key={me.id}
                  className={`event-popup-marker-event-item ${
                    me.id === event.id ? "active" : ""
                  }`}
                  onClick={() => onSelectEvent(me)}
                >
                  <span className="event-popup-marker-event-year">
                    {me.yearLabel}
                  </span>
                  <span className="event-popup-marker-event-title">
                    {me.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Footer — global navigation */}
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
      </div>

      {/* Lightbox for full screen image */}
      {isLightboxOpen && event.image && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
            <X size={32} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="lightbox-controls">
                    <button onClick={() => zoomIn()} title="Phóng to"><ZoomIn size={20} /></button>
                    <button onClick={() => zoomOut()} title="Thu nhỏ"><ZoomOut size={20} /></button>
                    <button onClick={() => resetTransform()} title="Đặt lại"><RotateCcw size={20} /></button>
                  </div>
                  <TransformComponent 
                    wrapperStyle={{ width: "100%", height: "100%" }} 
                    contentStyle={{ width: "100%", height: "100%", position: "relative" }}
                  >
                    <Image 
                      src={event.image!} 
                      alt={event.title}
                      fill
                      className="lightbox-img"
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
    </>
  );
}
