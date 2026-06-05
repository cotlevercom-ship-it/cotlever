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

  const links = [
    { href: '/members', label: 'Members' },
    { href: '/chat', label: 'Chat' },
    { href: '/profile', label: 'Profile' },
  ]

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      height: '56px',
      gap: '24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: '#534AB7', marginRight: 'auto' }}>
        Cotlever
      </a>
      {user && links.map(link => (
        
          key={link.href}
          href={link.href}
          style={{
            fontSize: '14px',
            fontWeight: pathname === link.h
