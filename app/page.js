'use client'

import Navbar from '@/components/Navbar'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const imageTranslateY = scrollY * 0.3
  const textTranslateY = scrollY * -0.15
  const opacity = Math.max(0, 1 - scrollY / 400)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500&family=Barlow+Condensed:wght@300;400;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #000;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          overflow-x: hidden;
        }

        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .star-field {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 35%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(2px 2px at 50% 25%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 75% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 20% 45%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 30%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 90%, rgba(255,255,255,0.3) 0%, transparent 100%);
          z-index: 0;
        }

        .divider-top {
          position: absolute;
          top: 22%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 10;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.35);
        }

        .divider-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.5);
          white-space: nowrap;
          text-transform: uppercase;
        }

        .hero-title-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
          text-align: center;
          width: 100%;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(100px, 18vw, 260px);
          line-height: 0.88;
          letter-spacing: 0.02em;
          color: #fff;
          user-select: none;
          mix-blend-mode: screen;
        }

        .hero-image-wrap {
          position: absolute;
          bottom: -5%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          width: min(900px, 95vw);
          will-change: transform;
        }

        .hero-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 -40px 80px rgba(255,255,255,0.08));
        }

        .bottom-vignette {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(to top, #000 0%, transparent 100%);
          z-index: 4;
          pointer-events: none;
        }

        .divider-bottom {
          position: absolute;
          bottom: 18%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: rgba(255,255,255,0.2);
          z-index: 10;
        }

        .hero-subtitle-bar {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: 80%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .sub-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 4px;
        }

        .sub-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.9);
        }

        .tagline-text {
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.02em;
          text-align: center;
        }

        .cta-btn {
          position: absolute;
          bottom: 6%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          border: 1px solid rgba(255,255,255,0.4);
          background: transparent;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 14px 36px;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s;
          white-space: nowrap;
        }
        .cta-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.7);
        }

        .sound-note {
          position: absolute;
          bottom: 1.5%;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          z-index: 10;
          white-space: nowrap;
        }

        .fade-in {
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }
        .fade-in-1 { animation-delay: 0.2s; }
        .fade-in-2 { animation-delay: 0.5s; }
        .fade-in-3 { animation-delay: 0.8s; }
        .fade-in-4 { animation-delay: 1.1s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .image-rise {
          opacity: 0;
          animation: riseUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.3s;
        }
        @keyframes riseUp {
          from { opacity: 0; transform: translateX(-50%) translateY(80px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .section-dark {
          background: #050505;
          padding: 120px 0;
        }

        .section-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .section-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 24px;
        }

        .section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 6vw, 90px);
          line-height: 0.95;
          color: #fff;
          margin-bottom: 32px;
        }

        .section-body {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.55);
          max-width: 560px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.08);
          margin-top: 80px;
        }

        .feature-card {
          background: #050505;
          padding: 48px 40px;
          transition: background 0.3s;
        }
        .feature-card:hover { background: #0d0d0d; }

        .feature-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          color: rgba(255,255,255,0.12);
          margin-bottom: 20px;
        }

        .feature-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 12px;
        }

        .feature-desc {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.45);
        }

        .join-section {
          background: #000;
          padding: 160px 0;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .join-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 32px;
        }

        .join-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(60px, 8vw, 120px);
          line-height: 0.9;
          color: #fff;
          margin-bottom: 48px;
        }

        .join-btn {
          border: 1px solid rgba(255,255,255,0.5);
          background: transparent;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 18px 52px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .join-btn:hover { background: rgba(255,255,255,0.07); }

        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr; }
          .hero-subtitle-bar { flex-direction: column; gap: 12px; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="hero-section" ref={heroRef}>
        <div className="star-field" />

        <div className="divider-top fade-in fade-in-1">
          <div className="divider-line" />
          <span className="divider-label">Business Community</span>
          <div className="divider-line" />
        </div>

        <div
          className="hero-title-wrap fade-in fade-in-2"
          ref={textRef}
          style={mounted ? {
            transform: `translate(-50%, calc(-50% + ${textTranslateY}px))`,
            opacity,
          } : {}}
        >
          <h1 className="hero-title">COT LEVER</h1>
        </div>

        <div
          className="hero-image-wrap image-rise"
          ref={imageRef}
          style={mounted ? {
            transform: `translateX(-50%) translateY(${imageTranslateY}px)`,
          } : {}}
        >
          <img src="/hero_clean.png" alt="Cot Lever" />
        </div>

        <div className="bottom-vignette" />
        <div className="divider-bottom" />

        <div
          className="hero-subtitle-bar fade-in fade-in-3"
          style={mounted ? { opacity } : {}}
        >
          <div>
            <p className="sub-label">Community</p>
            <p className="sub-value">Cot Lever</p>
          </div>
          <div>
            <p className="tagline-text">
              Connect with forward-thinking businesses.<br />
              Build partnerships that move the world forward.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="sub-label">Est.</p>
            <p className="sub-value">2024</p>
          </div>
        </div>

        <button className="cta-btn fade-in fade-in-4">
          Join the Community
        </button>

        <p className="sound-note">Where businesses grow together</p>
      </section>

      {/* ABOUT */}
      <section className="section-dark">
        <div className="section-inner">
          <p className="section-tag">About</p>
          <h2 className="section-heading">A New Era<br />Of Business</h2>
          <p className="section-body">
            Cot Lever is more than a community — it&apos;s a platform where ambitious entrepreneurs,
            seasoned professionals, and innovative companies come together to forge meaningful
            connections, share knowledge, and unlock new opportunities.
          </p>
          <div className="feature-grid">
            {[
              { n: '01', title: 'Connect', desc: 'Build real relationships with business leaders and entrepreneurs who share your vision and drive.' },
              { n: '02', title: 'Collaborate', desc: 'Find the right partners, investors, and collaborators to bring your next big idea to life.' },
              { n: '03', title: 'Grow', desc: 'Access resources, events, and a network designed to accelerate your business at every stage.' },
            ].map(f => (
              <div className="feature-card" key={f.n}>
                <p className="feature-number">{f.n}</p>
                <p className="feature-title">{f.title}</p>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section className="join-section">
        <p className="join-eyebrow">Ready to scale?</p>
        <h2 className="join-heading">Be Part Of<br />Something Big</h2>
        <button className="join-btn">Get Started Today</button>
      </section>
    </>
  )
}
