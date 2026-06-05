'use client'
import { useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const initials = ['RK','NH','IM','SA','TJ','MR','AR','FK','ZH','NB','SK','PD']
    const colors = ['#534AB7','#ff4444','#0F6E56','#BA7517','#185FA5','#993556']

    let nodes = []
    let W, H
    let animId

    function resize() {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
    }

    function init() {
      resize()
      nodes = []
      for (let i = 0; i < 12; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 22,
          label: initials[i],
          color: colors[i % colors.length],
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(255,68,68,${0.15 * (1 - dist / 160)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.fill()

        ctx.font = 'bold 11px sans-serif'
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.label, n.x, n.y)

        n.x += n.vx
        n.y += n.vy
        if (n.x < n.r || n.x > W - n.r) n.vx *= -1
        if (n.y < n.r || n.y > H - n.r) n.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()

    window.addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
        }} />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </main>
    </>
  )
}
