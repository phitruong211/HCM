"use client";

import { useState } from "react";

interface HeroOverlayProps {
  onStart: () => void;
}

export default function HeroOverlay({ onStart }: HeroOverlayProps) {
  const [closing, setClosing] = useState(false);

  const handleStart = () => {
    setClosing(true);
    setTimeout(() => {
      onStart();
    }, 750);
  };

  return (
    <div className={`hero-overlay ${closing ? "closing" : ""}`}>
      <div className="hero-content">
        <p className="hero-subtitle-top">Bản đồ lịch sử tương tác</p>

        <h1 className="hero-title">
          Hành Trình
          <span className="hero-title-accent">Tư Tưởng Hồ Chí Minh</span>
        </h1>

        <div className="hero-divider" />

        <p className="hero-description">
          Khám phá hành trình hình thành và phát triển tư tưởng của Chủ tịch Hồ
          Chí Minh qua 5 giai đoạn lịch sử — từ quê hương Nghệ An đến những
          chặng đường bôn ba khắp năm châu, tìm đường cứu nước.
        </p>

        <button className="hero-button" onClick={handleStart}>
          Mở bản đồ
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
