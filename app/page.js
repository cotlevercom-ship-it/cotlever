'use client'

import Navbar from '@/components/Navbar'
import { useEffect, useRef } from 'react'

export default function Home() {
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow: hidden; }
        .hero {
          position: relative;
          width: 100%;
          height: calc(100vh - 56px);
          overflow: hidden;
        }
        canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
      `}</style>

      <Navbar />
      <main className="hero">
        <canvas ref={canvasRef} />
      </main>
    </>
  )
}
