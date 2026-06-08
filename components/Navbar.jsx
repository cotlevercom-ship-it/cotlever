'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const links = [
  { label: 'Members', href: '/members' },
  { label: 'Product', href: '/product' },
  { label: 'Supplier', href: '/supplier' },
  { label: 'Startup', href: '/startup' },
  { label: 'Investors', href: '/investors' },
]

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [initials, setInitials] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
        const name = data.user.user_metadata?.name || data.user.email || ''
        setInitials(name.slice(0, 2).toUpperCase())
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      setUser(u || null)
      if (u) {
        const name = u.user_metadata?.name || u.email || ''
        setInitials(name.slice(0, 2).toUpperCase())
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <style>{`
        .logo-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0;
          cursor: pointer;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 2px;
          font-family: inherit;
        }
        .logo-cot { color: #fff; }
        .logo-lever {
          color: #fff;
          animation: leverSlide 3s ease-in-out infinite;
          transform-origin: left center;
          display: inline-block;
        }
        @keyframes leverSlide {
          0%   { transform: translateX(0px); }
          30%  { transform: translateX(0px); }
          45%  { transform: translateX(12px); }
          65%  { transform: translateX(12px); }
          85%  { transform: translateX(0px); }
          100% { transform: translateX(0px); }
        }
        .logo-gleam {
          position: absolute;
          inset: 0;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 2px;
          background-image: linear-gradient(90deg, transparent 30%, #ff0000 45%, #ff6060 50%, #ff0000 55%, transparent 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 100%;
          animation: gleam 3s ease-in-out infinite;
        }
        @keyframes gleam {
          0%   { background-position: 200% 0; }
          45%  { background-position: 50% 0; }
          100% { background-position: -100% 0; }
        }
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
          background: rgba(0, 0, 10, 0.6);
          backdrop-filter: blur(12px);
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          font-size: 13px;
          color: rgba(200, 210, 255, 0.6);
          padding: 6px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .nav-link.active {
          color: #fff;
          background: rgba(255,255,255,0.1);
        }
        .login-btn {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          padding: 7px 18px;
          border-radius: 8px;
          border: 0.5px solid rgba(255,255,255,0.2);
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          background: transparent;
        }
        .login-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #534AB7, #e84040);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          position: relative;
        }
        .avatar-menu {
          position: absolute;
          top: 44px;
          right: 0;
          background: rgba(10,10,30,0.95);
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 8px;
          min-width: 140px;
          display: none;
          flex-direction: column;
          gap: 4px;
          backdrop-filter: blur(12px);
        }
        .avatar:hover .avatar-menu {
          display: flex;
        }
        .avatar-menu a {
          font-size: 13px;
          color: rgba(200,210,255,0.7);
          padding: 8px 12px;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .avatar-menu a:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .avatar-menu .logout {
          color: #e84040;
        }
      `}</style>

      <nav className="navbar">
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div className="logo-wrapper">
              <span className="logo-cot">COT</span>
              <span className="logo-lever">LEVER</span>
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <span className="logo-gleam">COTLEVER</span>
            </div>
          </div>
        </a>

        {/* Nav Links */}
        <div className="nav-links">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Login or Avatar */}
        {user ? (
          <div className="avatar">
            {initials}
            <div className="avatar-menu">
              <a href="/profile">Profile</a>
              <a className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
            </div>
          </div>
        ) : (
          <a href="/login" className="login-btn">Login</a>
        )}
      </nav>
    </>
  )
}
