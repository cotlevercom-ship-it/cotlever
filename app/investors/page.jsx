// app/investors/page.jsx
'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function InvestorsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000005; color: #fff; }

        .page {
          min-height: calc(100vh - 56px);
          padding: 48px 32px;
          background: radial-gradient(ellipse at 20% 30%, rgba(255,180,80,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 70%, rgba(160,80,20,0.08) 0%, transparent 60%),
                      #000005;
        }

        .back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(160,180,255,0.6);
          text-decoration: none;
          margin-bottom: 40px;
          transition: color 0.2s;
        }
        .back:hover { color: #ffb450; }

        .header { margin-bottom: 48px; }

        .label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #ffb450;
          opacity: 0.7;
          margin-bottom: 10px;
        }

        h1 {
          font-family: 'Orbitron', monospace;
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 800;
          color: #fff;
          letter-spacing: 2px;
        }

        .placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          border: 1px dashed rgba(255,180,80,0.2);
          border-radius: 16px;
          background: rgba(255,180,80,0.02);
        }

        .placeholder p {
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
          color: rgba(255,180,80,0.3);
          text-transform: uppercase;
        }
      `}</style>

      <Navbar />
      <div className="page">
        <Link href="/home" className="back">← Back to Mission Control</Link>

        <div className="header">
          <div className="label">Module 03</div>
          <h1>Investors</h1>
        </div>

        {/* ---- তোমার Investors content এখানে যোগ করো ---- */}
        <div className="placeholder">
          <p>Investors content coming soon</p>
        </div>
      </div>
    </>
  )
}
