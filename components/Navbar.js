'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <style>{`
        .logo-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 3px;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-image: linear-gradient(90deg, #111 0%, #111 100%);
          display: inline-block;
        }
        .logo-gleam {
          position: absolute;
          inset: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 3px;
          background-image: linear-gradient(90deg, transparent 0%, transparent 30%, #ff0000 45%, #ff6060 50%, #ff0000 55%, transparent 70%, transparent 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 100%;
          animation: gleam 4.5s ease-in-out infinite;
        }
        @keyframes gleam {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>

      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span className="logo-text">COT LEVER</span>
            <span className="logo-gleam">COT LEVER</span>
          </div>
        </a>

        {user ? (
          <button onClick={logout} style={{
            fontSize: '14px',
            background: 'none',
            border: '1px solid #534AB7',
            color: '#534AB7',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}>
            Logout
          </button>
        ) : (
          <a href="/login" style={{
            fontSize: '14px',
            color: '#534AB7',
            textDecoration: 'none',
            fontWeight: 600,
            border: '1px solid #534AB7',
            padding: '6px 16px',
            borderRadius: '6px',
          }}>
            Login
          </a>
        )}
      </nav>
    </>
  )
}
