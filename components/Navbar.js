'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

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
        @keyframes logoSlide {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes letterPop {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .logo-letter {
          display: inline-block;
          animation: letterPop 0.4s ease forwards;
          opacity: 0;
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
          {'Cotlever'.split('').map((letter, i) => (
            <span
              key={i}
              className="logo-letter"
              style={{
                animationDelay: `${i * 0.06}s`,
                fontSize: '20px',
                fontWeight: 700,
                color: '#534AB7',
              }}
            >
              {letter}
            </span>
          ))}
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
