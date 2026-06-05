'use client'

import Navbar from '@/components/Navbar'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const canvasRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const STAR_COUNT = 600
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
    }))

    const DUST_COUNT = 120
    const dust = Array.from({ length: DUST_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 280 + 40
      return {
        angle,
        radius,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        speed: (Math.random() * 0.0003 + 0.0001) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.5 ? '180,160,255' : '100,180,255',
      }
    })

    let frame = 0

    const draw = () => {
      frame++
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000005'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 320)
      grd.addColorStop(0, 'rgba(80, 40, 160, 0.18)')
      grd.addColorStop(0.4, 'rgba(40, 20, 100, 0.08)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const grd2 = ctx.createRadialGradient(cx - 80, cy + 30, 0, cx - 80, cy + 30, 200)
      grd2.addColorStop(0, 'rgba(30, 80, 180, 0.12)')
      grd2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      dust.forEach(d => {
        d.angle += d.speed
        const x = cx + Math.cos(d.angle) * d.radius
        const y = cy + Math.sin(d.angle) * d.radius * 0.38
        ctx.beginPath()
        ctx.arc(x, y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.color}, ${d.opacity})`
        ctx.fill()
      })

      stars.forEach(s => {
        s.x -= s.speed
        if (s.x < 0) {
          s.x = canvas.width
          s.y = Math.random() * canvas.height
        }
        s.twinkle += 0.02
        const twinkleOpacity = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle))

        if (s.size > 1) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3)
          glow.addColorStop(0, `rgba(200,220,255,${twinkleOpacity * 0.4})`)
          glow.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,230,255,${twinkleOpacity})`
        ctx.fill()
      })

      if (frame % 180 === 0) {
        const sx = Math.random() * canvas.width
        const sy = Math.random() * canvas.height * 0.5
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(sx + 80, sy + 20)
        const shootGrd = ctx.createLinearGradient(sx, sy, sx + 80, sy + 20)
        shootGrd.addColorStop(0, 'rgba(255,255,255,0)')
        shootGrd.addColorStop(0.5, 'rgba(255,255,255,0.8)')
        shootGrd.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = shootGrd
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const textTranslateY = scrollY * -0.12
  const opacity = Math.max(0, 1 - scrollY / 500)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400&family=Barlow+Condensed:wght@300;400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #000;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          overflow-x: hidden;
        }

        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .top-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(180,160,255,0.6);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .top-label::before, .top-label::after {
          content: '';
          display: block;
          width: 50px;
          height: 1px;
          background: rgba(180,160,255,0.35);
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(90px, 16vw, 220px);
          line-height: 0.9;
          letter-spacing: 0.04em;
          color: #fff;
          text-shadow: 0 0 80px rgba(140,100,255,0.4), 0 0 160px rgba(80,60,200,0.2);
          user-select: none;
        }

        .hero-tagline {
          margin-top: 24px;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(200,190,255,0.55);
          line-height: 1.7;
        }

        .hero-image-wrap {
          position: absolute;
          bottom: -8%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          width: min(860px, 90vw);
          pointer-events: none;
        }

        .hero-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 -30px 60px rgba(120,80,255,0.15));
          animation: floatUp 1.6s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0;
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to top, #000 0%, transparent 100%);
          z-index: 4;
          pointer-events: none;
        }

        .divider {
          position: absolute;
          bottom: 19%;
          left: 50%;
          transform: translateX(-50%);
          width: 75%;
          height: 1px;
          background: rgba(255,255,255,0.1);
          z-index: 10;
        }

        .info-bar {
          position: absolute;
          bottom: 20.5%;
          left: 50%;
          transform: translateX(-50%);
          width: 75%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          z-index: 10;
          pointer-events: none;
        }

        .info-item { display: flex; flex-direction: column; gap: 4px; }
        .info-item.right { text-align: right; }

        .info-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .info-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.05em;
        }

        .cta-wrap {
          position: absolute;
          bottom: 5.5%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .cta-btn {
          border: 1px solid rgba(180,160,255,0.35);
          background: transparent;
          color: rgba(200,190,255,0.9);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 13px 40px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          pointer-events: all;
        }
        .cta-btn:hover {
          background: rgba(140,100,255,0.12);
          border-color: rgba(180,160,255,0.7);
          color: #fff;
        }

        .scroll-hint {
          position: absolute;
          bottom: 1.5%;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          z-index: 10;
          white-space: nowrap;
        }

        .fade-in { opacity: 0; animation: fadeIn 1s ease forwards; }
        .d1 { animation-delay: 0.2s; }
        .d2 { animation-delay: 0.5s; }
        .d3 { animation-delay: 0.8s; }
        .d4 { animation-delay: 1s; }
        .d5 { animation-delay: 1.2s; }
        .d6 { animation-delay: 1.4s; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section {
          background: #03020a;
          padding: 110px 0;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .inner { max-width: 1080px; margin: 0 auto; padding: 0 40px; }

        .s-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(160,140,255,0.5);
          margin-bottom: 20px;
        }

        .s-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 6vw, 86px);
          line-height: 0.95;
          color: #fff;
          margin-bottom: 28px;
        }

        .s-body {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.85;
          color: rgba(255,255,255,0.45);
          max-width: 520px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          margin-top: 70px;
        }

        .card { background: #03020a; padding: 44px 36px; transition: background 0.3s; }
        .card:hover { background: #07060f; }

        .card-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px;
          color: rgba(140,120,255,0.15);
          margin-bottom: 16px;
        }

        .card-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(200,190,255,0.85);
          margin-bottom: 10px;
        }

        .card-desc {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(255,255,255,0.38);
        }

        .join {
          background: #000;
          padding: 140px 0;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .join-eye {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(160,140,255,0.4);
          margin-bottom: 28px;
        }

        .join-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 8vw, 110px);
          line-height: 0.9;
          color: #fff;
          margin-bottom: 44px;
          text-shadow: 0 0 60px rgba(120,80,255,0.25);
        }

        .join-btn {
          border: 1px solid rgba(180,160,255,0.4);
          background: transparent;
          color: rgba(200,190,255,0.85);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 16px 48px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .join-btn:hover {
          background: rgba(140,100,255,0.1);
          border-color: rgba(180,160,255,0.7);
          color: #fff;
        }

        @media (max-width: 768px) {
          .cards { grid-template-columns: 1fr; }
          .info-bar { display: none; }
        }
      `}</style>

      <Navbar />

      <section className="hero">
        <canvas ref={canvasRef} />

        <div
          className="hero-content"
          style={mounted ? { transform: `translateY(${textTranslateY}px)`, opacity } : {}}
        >
          <p className="top-label fade-in d1">Business Community</p>
          <h1 className="hero-title fade-in d2">COT LEVER</h1>
          <p className="hero-tagline fade-in d3">
            Connect. Collaborate. Grow.<br />
            Where ambitious businesses find their edge.
          </p>
        </div>

        <div className="hero-image-wrap">
          <img src="/hero_clean.png" alt="Cot Lever" />
        </div>

        <div className="bottom-fade" />
        <div className="divider fade-in d4" />

        <div className="info-bar fade-in d4" style={mounted ? { opacity } : {}}>
          <div className="info-item">
            <span className="info-label">Community</span>
            <span className="info-value">Cot Lever</span>
          </div>
          <div className="info-item right">
            <span className="info-label">Est.</span>
            <span className="info-value">2024</span>
          </div>
        </div>

        <div className="cta-wrap fade-in d5">
          <button className="cta-btn">Join the Community</button>
        </div>

        <p className="scroll-hint fade-in d6">Scroll to explore</p>
      </section>

      <section className="section">
        <div className="inner">
          <p className="s-tag">About</p>
          <h2 className="s-heading">A New Era<br />Of Business</h2>
          <p className="s-body">
            Cot Lever is more than a community — it&apos;s a platform where ambitious entrepreneurs,
            seasoned professionals, and innovative companies come together to forge meaningful
            connections, share knowledge, and unlock new opportunities.
          </p>
          <div className="cards">
            {[
              { n: '01', t: 'Connect', d: 'Build real relationships with business leaders and entrepreneurs who share your vision and drive.' },
              { n: '02', t: 'Collaborate', d: 'Find the right partners, investors, and collaborators to bring your next big idea to life.' },
              { n: '03', t: 'Grow', d: 'Access resources, events, and a network designed to accelerate your business at every stage.' },
            ].map(c => (
              <div className="card" key={c.n}>
                <p className="card-num">{c.n}</p>
                <p className="card-title">{c.t}</p>
                <p className="card-desc">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="join">
        <p className="join-eye">Ready to scale?</p>
        <h2 className="join-heading">Be Part Of<br />Something Big</h2>
        <button className="join-btn">Get Started Today</button>
      </section>
    </>
  )
}
