'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/members')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#534AB7', display: 'block', marginBottom: '24px', textAlign: 'center' }}>Cotlever</a>
        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>Welcome back</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          No account? <a href="/register" style={{ color: '#534AB7', fontWeight: 500 }}>Register</a>
        </p>
      </div>
    </main>
  )
}
