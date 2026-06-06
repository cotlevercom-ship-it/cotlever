// app/home/page.jsx
'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const features = [
  {
    title: 'Product',
    description: 'Manage and explore your product catalog',
    href: '/product',
    icon: '◈',
    color: '100,200,255',
    glow: '#64c8ff',
  },
  {
    title: 'Supplier',
    description: 'Connect and manage your supply chain',
    href: '/supplier',
    icon: '⬡',
    color: '180,140,255',
    glow: '#b48cff',
  },
  {
    title: 'Investors',
    description: 'Track and engage with your investors',
    href: '/investors',
    icon: '◎',
    color: '255,180,80',
    glow: '#ffb450',
  },
  {
    title: 'Startup',
    description: 'Discover and collaborate with startups',
    href: '/startup',
    icon: '△',
    color: '80,255,180',
    glow: '#50ffb4',
  },
]

export default function HomePage() {
  const canvasRef = useRef(null)

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow-x: hidden; }

        .home-wrap {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 56px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
        }

        canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          text-align: center;
          width: 100%;
          max-width: 960px;
        }

        .greeting {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 300;
          font-size: 14px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(160, 180, 255, 0.7);
          margin-bottom: 12px;
          animation: fadeUp 0.8s ease forwards;
          opacity: 0;
        }

        .headline {
          font-family: 'Orbitron', monospace;
          font-weight: 800;
          font-size: clamp(28px, 5vw, 52px);
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 12px;
          animation: fadeUp 0.8s 0.15s ease forwards;
          opacity: 0;
        }

        .headline span {
          background: linear-gradient(90deg, #64c8ff, #b48cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subline {
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          color: rgba(200, 210, 255, 0.5);
          letter-spacing: 1px;
          margin-bottom: 60px;
          animation: fadeUp 0.8s 0.3s ease forwards;
          opacity: 0;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 600px) {
          .cards { grid-template-columns: 1fr; }
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 28px 28px 24px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          text-decoration: none;
          transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
          overflow: hidden;
          animation: fadeUp 0.8s ease forwards;
          opacity: 0;
          cursor: pointer;
        }

        .card:nth-child(1) { animation-delay: 0.45s; }
        .card:nth-child(2) { animation-delay: 0.55s; }
        .card:nth-child(3) { animation-delay: 0.65s; }
        .card:nth-child(4) { animation-delay: 0.75s; }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card:hover::before { opacity: 1; }
        .card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
        }

        .card-glow {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          opacity: 0.12;
          filter: blur(40px);
          transition: opacity 0.3s ease;
        }
        .card:hover .card-glow { opacity: 0.28; }

        .card-icon {
          font-size: 28px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .card-title {
          font-family: 'Orbitron', monospace;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 1px;
        }

        .card-desc {
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          color: rgba(200,210,255,0.5);
          font-weight: 400;
          letter-spacing: 0.5px;
          line-height: 1.5;
        }

        .card-arrow {
          position: absolute;
          bottom: 20px;
          right: 24px;
          font-size: 18px;
          color: rgba(255,255,255,0.2);
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .card:hover .card-arrow {
          color: rgba(255,255,255,0.7);
          transform: translateX(4px);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar />
      <canvas ref={canvasRef} />

      <main className="home-wrap">
        <div className="content">
          <p className="greeting">Welcome back, Explorer</p>
          <h1 className="headline">Mission <span>Control</span></h1>
          <p className="subline">Select a module to begin your journey</p>

          <div className="cards">
            {features.map((f) => (
              <Link key={f.title} href={f.href} className="card">
                <div
                  className="card-glow"
                  style={{ background: f.glow }}
                />
                <div className="card-icon" style={{ color: f.glow }}>{f.icon}</div>
                <div className="card-title">{f.title}</div>
                <div className="card-desc">{f.description}</div>
                <span className="card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
