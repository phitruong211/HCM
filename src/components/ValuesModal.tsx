"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface ValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── SVG Assets (Inline) ───

const DongSonWatermark = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', opacity: 0.03, pointerEvents: 'none', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(2)' }}>
    <circle cx="200" cy="200" r="180" stroke="#c9a24b" strokeWidth="2" strokeDasharray="10 5" />
    <circle cx="200" cy="200" r="160" stroke="#c9a24b" strokeWidth="4" />
    <circle cx="200" cy="200" r="140" stroke="#c9a24b" strokeWidth="1" />
    <path d="M200 40 L220 60 L200 80 L180 60 Z" fill="#c9a24b" />
    <path d="M200 360 L220 340 L200 320 L180 340 Z" fill="#c9a24b" />
    <path d="M40 200 L60 180 L80 200 L60 220 Z" fill="#c9a24b" />
    <path d="M360 200 L340 180 L320 200 L340 220 Z" fill="#c9a24b" />
    <circle cx="200" cy="200" r="100" stroke="#c9a24b" strokeWidth="2" />
    <circle cx="200" cy="200" r="40" fill="#c9a24b" />
    {/* Stylized rays */}
    {[...Array(12)].map((_, i) => (
      <line key={i} x1="200" y1="160" x2="200" y2="100" stroke="#c9a24b" strokeWidth="3" transform={`rotate(${i * 30} 200 200)`} />
    ))}
  </svg>
);

const IconStarFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><polygon points="12 6 13.5 10.5 18 10.5 14.5 13.5 15.5 18 12 15.5 8.5 18 9.5 13.5 6 10.5 10.5 10.5" fill="currentColor"/></svg>
);
const IconSun = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const IconHands = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 12c-2-2-4-3-6-3s-4 1-4 3 2 4 4 4 2 0 4-1 2-3 2-3z"/><path d="M12 12c2-2 4-3 6-3s4 1 4 3-2 4-4 4-2 0-4-1-2-3-2-3z"/></svg>
);
const IconGlobeDove = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconHeroMedal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
);

const StampSVG = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="90" height="90" stroke="#a52a2a" strokeWidth="4" fill="rgba(165,42,42,0.1)"/>
    <rect x="12" y="12" width="76" height="76" stroke="#a52a2a" strokeWidth="2"/>
    <path d="M25 25 H45 V75 H25 Z" fill="#a52a2a"/>
    <path d="M55 25 H75 V45 H55 Z" fill="#a52a2a"/>
    <path d="M55 55 H75 V75 H55 Z" fill="#a52a2a"/>
    <circle cx="50" cy="50" r="8" fill="#1a140d"/>
  </svg>
);

const WorldMapOutline = () => (
  <svg viewBox="0 0 1000 500" fill="none" stroke="rgba(201, 162, 75, 0.08)" strokeWidth="1" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '120%', minWidth: '800px', pointerEvents: 'none', zIndex: 0 }}>
    <path d="M250,150 Q300,100 350,120 T450,100 T550,150 T600,100 T700,150 T800,100 T850,200 T800,300 T700,350 T650,400 T550,350 T450,400 T350,350 T250,300 T200,200 Z" />
    <path d="M100,200 Q150,150 200,180 T250,250 T200,300 T150,350 T100,300 Z" />
    <path d="M750,250 Q800,200 850,250 T800,350 T700,300 Z" />
    <circle cx="680" cy="220" r="10" />
    <circle cx="720" cy="280" r="5" />
    <circle cx="750" cy="250" r="8" />
  </svg>
);


// ─── Component ───

function ValuesModalContent({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.05], [0, -50]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="museum-modal-container"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

        .museum-modal-container {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: linear-gradient(135deg, #1a140d 0%, #14100a 100%);
          overflow-y: auto;
          overflow-x: hidden;
          color: #ece3d1;
          font-family: 'Be Vietnam Pro', sans-serif;
          scroll-behavior: smooth;
        }

        .museum-noise {
          position: fixed;
          inset: 0;
          z-index: 0;
          opacity: 0.2;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .museum-close-btn {
          position: fixed;
          top: 32px;
          right: 32px;
          z-index: 100001;
          background: transparent;
          border: 1px solid rgba(201, 162, 75, 0.3);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a24b;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .museum-close-btn:hover {
          background: rgba(201, 162, 75, 0.1);
          transform: rotate(90deg);
          border-color: #e8c97a;
          color: #e8c97a;
          box-shadow: 0 0 15px rgba(201, 162, 75, 0.2);
        }

        .museum-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Typography */
        .font-serif { font-family: 'Playfair Display', serif; }
        .text-gold {
          background: linear-gradient(to bottom, #e8c97a, #c9a24b, #a67c2e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #c9a24b;
        }
        .text-gold-solid { color: #c9a24b; }
        .text-red { color: #8b1e1e; }
        
        /* Hero */
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .hero-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(201, 162, 75, 0.1) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-subtitle {
          font-size: 0.9rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #a89a82;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        .hero-title-1 {
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(201, 162, 75, 0.2);
          margin-bottom: 0;
          line-height: 1.1;
          position: relative;
          z-index: 1;
        }
        .hero-title-2 {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 400;
          font-style: italic;
          color: #ece3d1;
          margin-bottom: 3rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          position: relative;
          z-index: 1;
        }
        .hero-quote-box {
          position: relative;
          max-width: 700px;
          padding: 3rem 0;
          z-index: 1;
        }
        .hero-quote-box::before, .hero-quote-box::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a24b, transparent);
        }
        .hero-quote-box::before { top: 0; }
        .hero-quote-box::after { bottom: 0; }
        .hero-quote {
          font-size: clamp(1.2rem, 2vw, 1.4rem);
          font-style: italic;
          color: #ece3d1;
          line-height: 1.8;
          text-align: center;
          font-family: 'Playfair Display', serif;
        }
        .hero-quote-marks {
          font-size: 4rem;
          color: rgba(201, 162, 75, 0.3);
          position: absolute;
          font-family: serif;
          line-height: 0;
        }
        .quote-left { top: 2rem; left: -2rem; }
        .quote-right { bottom: 0rem; right: -2rem; transform: rotate(180deg); }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s infinite;
          color: #c9a24b;
          opacity: 0.6;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }

        /* Particles */
        .particles { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .particle {
          position: absolute;
          background: #e8c97a;
          border-radius: 50%;
          opacity: 0;
          animation: floatUp 8s infinite linear;
          box-shadow: 0 0 8px #e8c97a;
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-20vh) scale(1.5); opacity: 0; }
        }

        /* Section Headings */
        .section-heading-wrapper {
          text-align: center;
          margin: 6rem 0 4rem;
          position: relative;
        }
        .section-heading-wrapper::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 162, 75, 0.3), transparent);
          z-index: 0;
        }
        .section-heading-content {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: #14100a;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }
        .section-roman {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: #8b1e1e;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }
        .section-title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .section-title-ornament {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        .ornament-line { width: 30px; height: 1px; background: #c9a24b; }
        .ornament-diamond { width: 6px; height: 6px; background: #c9a24b; transform: rotate(45deg); }

        /* Subsection Titles */
        .sub-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ece3d1;
          margin-bottom: 2rem;
          position: relative;
          padding-left: 1.5rem;
        }
        .sub-section-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.4rem;
          bottom: 0.4rem;
          width: 3px;
          background: linear-gradient(to bottom, #e8c97a, #a67c2e);
        }

        /* Timeline (Section A.a) */
        .timeline-container {
          position: relative;
          margin-left: 1rem;
          padding-left: 2rem;
          border-left: 1px solid rgba(201, 162, 75, 0.3);
          margin-bottom: 4rem;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 2.5rem;
        }
        .timeline-dot {
          position: absolute;
          left: -2.45rem;
          top: 0.2rem;
          width: 14px;
          height: 14px;
          background: #14100a;
          border: 2px solid #c9a24b;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(201, 162, 75, 0.5);
          transition: all 0.5s ease;
        }
        .timeline-item:hover .timeline-dot {
          background: #c9a24b;
          box-shadow: 0 0 20px rgba(201, 162, 75, 0.8);
        }
        .item-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #e8c97a;
          margin-bottom: 0.5rem;
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.05em;
        }
        .item-desc {
          font-size: 0.95rem;
          color: #a89a82;
          line-height: 1.6;
        }

        /* Cards (Section A.b) */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .museum-card {
          background: rgba(201, 162, 75, 0.03);
          border: 1px solid rgba(201, 162, 75, 0.2);
          padding: 2rem 1.5rem;
          position: relative;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .museum-card::before, .museum-card::after {
          content: ''; position: absolute; width: 10px; height: 10px; border: 1px solid #c9a24b; transition: all 0.4s ease;
        }
        .museum-card::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .museum-card::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
        
        .museum-card:hover {
          transform: translateY(-5px);
          background: rgba(201, 162, 75, 0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(201, 162, 75, 0.1);
          border-color: rgba(201, 162, 75, 0.4);
        }
        .museum-card:hover::before, .museum-card:hover::after {
          width: 100%; height: 100%; opacity: 0.1;
        }
        .card-icon {
          width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(201, 162, 75, 0.5);
          display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;
          color: #c9a24b;
        }

        /* Core Goals Badge */
        .goals-badge {
          border: 1px solid rgba(201, 162, 75, 0.3);
          padding: 3rem 2rem;
          position: relative;
          text-align: center;
          background: linear-gradient(180deg, rgba(139, 30, 30, 0.05) 0%, rgba(0,0,0,0) 100%);
          margin-bottom: 4rem;
        }
        .goals-title {
          position: absolute;
          top: -12px; left: 50%; transform: translateX(-50%);
          background: #14100a; padding: 0 1rem;
          font-family: 'Playfair Display', serif;
          color: #c9a24b; letter-spacing: 0.1em;
          border-left: 1px solid rgba(201, 162, 75, 0.5);
          border-right: 1px solid rgba(201, 162, 75, 0.5);
        }
        .goals-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
        }
        @media (max-width: 768px) {
          .goals-grid { grid-template-columns: 1fr; }
        }
        .goal-item { display: flex; flex-direction: column; align-items: center; }
        .goal-icon { color: #8b1e1e; margin-bottom: 1rem; }
        .goal-label { font-size: 1.2rem; font-weight: 600; color: #ece3d1; margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;}
        .goal-sub { font-size: 0.9rem; color: #a89a82; }

        /* Section B (World) Background Modifier */
        .world-section {
          position: relative;
          background: radial-gradient(circle at center, rgba(10, 20, 30, 0.4) 0%, transparent 70%);
          padding: 4rem 0;
          margin: 0 -24px;
          padding-left: 24px;
          padding-right: 24px;
        }

        /* Portrait Layout */
        .portrait-layout {
          display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; margin-bottom: 4rem; align-items: center;
        }
        @media (max-width: 768px) {
          .portrait-layout { grid-template-columns: 1fr; }
        }
        .portrait-card {
          border: 1px solid #c9a24b;
          padding: 3rem 2rem;
          text-align: center;
          position: relative;
          background: rgba(0,0,0,0.4);
          box-shadow: 0 0 30px rgba(201, 162, 75, 0.1) inset;
        }
        .portrait-card::before {
          content: ''; position: absolute; inset: -4px; border: 1px solid rgba(201, 162, 75, 0.3); pointer-events: none;
        }
        .grid-2col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
        }
        @media (max-width: 640px) {
          .grid-2col { grid-template-columns: 1fr; }
        }
        
        .feature-item { display: flex; gap: 1rem; }
        .feature-icon { min-width: 32px; height: 32px; border-radius: 50%; border: 1px solid #c9a24b; display: flex; align-items: center; justify-content: center; color: #c9a24b;}

        /* Medals */
        .medals-container {
          display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem; margin-top: 5rem;
        }
        .medal {
          display: flex; flex-direction: column; align-items: center; width: 200px; text-align: center;
        }
        .medal-icon-wrapper {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #1a140d, #2a2015);
          border: 2px solid #a52a2a;
          box-shadow: 0 0 0 4px #1a140d, 0 0 0 6px #c9a24b, 0 10px 20px rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; color: #c9a24b;
          margin-bottom: 1.5rem; position: relative;
        }
        .medal-icon-wrapper::before {
          content: ''; position: absolute; top: -15px; width: 30px; height: 20px;
          background: repeating-linear-gradient(90deg, #a52a2a, #a52a2a 10px, #c9a24b 10px, #c9a24b 20px);
          clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
        }
        .medal-text { font-family: 'Playfair Display', serif; font-size: 1rem; color: #ece3d1; font-weight: 600; }

        /* Footer */
        .museum-footer {
          margin-top: 8rem;
          text-align: center;
          position: relative;
          padding-bottom: 4rem;
        }
        .footer-quote {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #c9a24b;
          font-style: italic;
          margin-bottom: 2rem;
        }
        .stamp-wrapper {
          display: flex; justify-content: center; opacity: 0.8;
        }

      `}} />

      {/* Background Elements */}
      <div className="museum-noise" />
      <DongSonWatermark />

      {/* Close */}
      <button onClick={onClose} className="museum-close-btn" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 4 + 6}s`
          }} />
        ))}
      </div>

      <div className="museum-content">
        {/* HERO SECTION */}
        <motion.section className="hero-section" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="hero-glow" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="hero-subtitle">— DI SẢN TƯ TƯỞNG —</span>
            <h1 className="hero-title-1 font-serif text-gold">Giá Trị Tư Tưởng</h1>
            <h2 className="hero-title-2 font-serif">Hồ Chí Minh</h2>
            
            <div className="hero-quote-box">
              <span className="hero-quote-marks quote-left">"</span>
              <p className="hero-quote">
                Di sản tinh thần vô giá, kim chỉ nam cho sự nghiệp cách mạng Việt Nam 
                và cống hiến to lớn cho sự phát triển tiến bộ của nhân loại.
              </p>
              <span className="hero-quote-marks quote-right">"</span>
            </div>
          </motion.div>
          <div className="scroll-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </motion.section>

        {/* SECTION I */}
        <section>
          <motion.div className="section-heading-wrapper" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="section-heading-content">
              <span className="section-roman">I</span>
              <h2 className="section-title text-gold">Đối với cách mạng Việt Nam</h2>
              <div className="section-title-ornament">
                <div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" />
              </div>
            </div>
          </motion.div>

          {/* Mục a */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h3 className="sub-section-title font-serif">
              a) Đưa cách mạng giải phóng dân tộc Việt Nam đến thắng lợi và bắt đầu xây dựng một xã hội mới
            </h3>
            <div className="timeline-container">
              {[
                { title: "Thắng lợi thực tiễn", desc: "Tìm đường cứu nước, lập Đảng, lãnh đạo thành công Cách mạng Tháng Tám (1945)." },
                { title: "Kỷ nguyên mới", desc: "Độc lập dân tộc gắn liền với chủ nghĩa xã hội." },
                { title: "Ngọn cờ xuyên suốt", desc: "Kháng chiến chống Pháp → Xây dựng miền Bắc → Cách mạng miền Nam → Thống nhất, đi lên CNXH (1975)." },
                { title: "Hệ thống lý luận bảo đảm thắng lợi", desc: "Xây dựng Đảng cầm quyền trong sạch; Nhà nước của dân, do dân, vì dân; Mặt trận dân tộc thống nhất; Khối đại đoàn kết." },
                { title: "Hệ thống lý luận mở", desc: "Tiếp tục được Đảng vận dụng, phát triển trong công cuộc đổi mới." },
              ].map((item, i) => (
                <motion.div key={i} className="timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <div className="timeline-dot" />
                  <h4 className="item-title">{item.title}</h4>
                  <p className="item-desc">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mục b */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h3 className="sub-section-title font-serif" style={{ marginTop: '5rem' }}>
              b) Là nền tảng tư tưởng và kim chỉ nam cho cách mạng Việt Nam
            </h3>
            
            <div className="cards-grid">
              {[
                { title: "Tư tưởng bản địa", icon: <IconStarFlag />, desc: "Lần đầu tiên cách mạng soi đường bởi tư tưởng của chính người Việt Nam." },
                { title: "Nhận thức đúng đắn", icon: <IconSun />, desc: "Bảo vệ độc lập, phát triển kinh tế - xã hội, bảo đảm tự do/hạnh phúc, tiến lên CNXH." },
                { title: "Chỗ dựa vững chắc", icon: <IconHands />, desc: 'Vạch đường lối, thực hiện mục tiêu "dân giàu, nước mạnh..."; mang giá trị trường tồn.' },
              ].map((item, i) => (
                <motion.div key={i} className="museum-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <div className="card-icon">{item.icon}</div>
                  <h4 className="item-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{item.title}</h4>
                  <p className="item-desc" style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Hệ mục tiêu cơ bản */}
            <div className="goals-badge">
              <div className="goals-title">HỆ MỤC TIÊU CƠ BẢN</div>
              <div className="goals-grid">
                <div className="goal-item">
                  <div className="goal-icon"><IconStarFlag /></div>
                  <div className="goal-label">Tổ quốc</div>
                  <div className="goal-sub">Độc lập, thống nhất.</div>
                </div>
                <div className="goal-item">
                  <div className="goal-icon"><IconHands /></div>
                  <div className="goal-label">Nhân dân</div>
                  <div className="goal-sub">Tự do, dân chủ, công bằng, hạnh phúc.</div>
                </div>
                <div className="goal-item">
                  <div className="goal-icon"><IconGlobeDove /></div>
                  <div className="goal-label">Quốc tế</div>
                  <div className="goal-sub">Hòa bình, hữu nghị, phát triển quan hệ văn hóa, nhân văn.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION II */}
        <section className="world-section">
          <WorldMapOutline />
          
          <motion.div className="section-heading-wrapper" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="section-heading-content" style={{ background: 'transparent' }}>
              <span className="section-roman">II</span>
              <h2 className="section-title text-gold" style={{ textAlign: 'center' }}>Đối với sự phát triển tiến bộ<br/>của nhân loại</h2>
              <div className="section-title-ornament">
                <div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" />
              </div>
            </div>
          </motion.div>

          {/* Mục a */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h3 className="sub-section-title font-serif">
              a) Mở ra cho các dân tộc thuộc địa con đường giải phóng dân tộc gắn với sự tiến bộ xã hội
            </h3>
            
            <div className="portrait-layout">
              <motion.div className="portrait-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <div className="card-icon" style={{ margin: '0 auto 1.5rem', width: 64, height: 64, color: '#e8c97a' }}>
                  <IconSun />
                </div>
                <h4 className="item-title" style={{ fontSize: '1.4rem', color: '#e8c97a' }}>Biểu tượng thời đại</h4>
                <p className="item-desc">Anh hùng giải phóng dân tộc thế kỷ XX, đáp ứng yêu cầu của thời đại mới.</p>
              </motion.div>
              
              <div className="grid-2col">
                {[
                  { title: "Cống hiến lý luận cốt lõi", desc: "Cách mạng giải phóng dân tộc đi theo con đường vô sản (toàn dân tiến hành, nòng cốt công - nông, Đảng lãnh đạo)." },
                  { title: "Tính chủ động, sáng tạo", desc: "Có thể thắng lợi trước cách mạng chính quốc bằng bạo lực (kết hợp chính trị và vũ trang)." },
                  { title: "Bổ sung lý luận Mác - Lênin", desc: "Giải quyết mối quan hệ dân tộc - thuộc địa, dân tộc - giai cấp, độc lập dân tộc - CNXH; gắn giải phóng dân tộc với giải phóng con người." },
                  { title: "Vai trò tiên phong", desc: "Góp phần to lớn làm sụp đổ hệ thống thuộc địa của chủ nghĩa thực dân." },
                ].map((item, i) => (
                  <motion.div key={i} className="feature-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div className="feature-icon"><div className="ornament-diamond"/></div>
                    <div>
                      <h4 className="item-title" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p className="item-desc" style={{ fontSize: '0.85rem' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mục b */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h3 className="sub-section-title font-serif" style={{ marginTop: '5rem' }}>
              b) Góp phần tích cực vào cuộc đấu tranh vì độc lập dân tộc, dân chủ, hòa bình, hợp tác và phát triển trên thế giới
            </h3>

            <div className="cards-grid" style={{ position: 'relative', zIndex: 1 }}>
              {[
                { title: "Xu thế hợp tác quốc tế", desc: "Phá bỏ biệt lập, liên kết dân tộc nhỏ yếu để chống lại chính sách 'chia để trị'." },
                { title: "Gắn kết các phong trào", desc: "Kết nối cách mạng Việt Nam với phong trào giải phóng dân tộc, công nhân tư bản, cộng sản quốc tế và phong trào hòa bình thế giới." },
                { title: "Mục tiêu hợp tác toàn diện", desc: "Không chỉ giành độc lập mà còn xóa nghèo nàn, lạc hậu, phát triển lực lượng sản xuất, tiến kịp nước tiên tiến." },
                { title: "Chủ trương đối ngoại", desc: '"Làm bạn với tất cả mọi nước dân chủ", không gây thù oán; thúc đẩy hội nhập, hòa bình, hữu nghị.' },
                { title: "Nguyên tắc hợp tác", desc: "Giữ vững độc lập chủ quyền, bình đẳng cùng có lợi; kết hợp sức mạnh dân tộc và thời đại; làm tròn nghĩa vụ quốc tế." },
              ].map((item, i) => (
                <motion.div key={i} className="museum-card" style={{ padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <h4 className="item-title" style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="ornament-diamond" style={{ width: 4, height: 4 }}/> {item.title}
                  </h4>
                  <p className="item-desc" style={{ fontSize: '0.85rem' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Medals */}
            <div className="medals-container">
              <div style={{ width: '100%', textAlign: 'center', marginBottom: '-1rem' }}>
                <span className="text-red font-serif" style={{ letterSpacing: '0.1em', fontSize: '1.1rem', textTransform: 'uppercase' }}>Sự ghi nhận của Đảng (Đại hội XII)</span>
              </div>
              {[
                "Anh hùng giải phóng dân tộc",
                "Danh nhân văn hóa thế giới",
                "Chiến sĩ cộng sản quốc tế mẫu mực"
              ].map((text, i) => (
                <motion.div key={i} className="medal" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}>
                  <div className="medal-icon-wrapper">
                    <IconHeroMedal />
                  </div>
                  <div className="medal-text">{text}</div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </section>

        {/* FOOTER */}
        <motion.div className="museum-footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <p className="footer-quote">"Di sản tư tưởng Hồ Chí Minh sống mãi"</p>
          <div className="stamp-wrapper">
            <StampSVG />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default function ValuesModal({ isOpen, onClose }: ValuesModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && <ValuesModalContent onClose={onClose} />}
    </AnimatePresence>
  );
}
