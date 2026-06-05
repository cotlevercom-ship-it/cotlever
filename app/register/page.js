'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        bio: '',
        role: 'member',
      })
      router.push('/members')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#534AB7', display: 'block', marginBottom: '24px', textAlign: 'center' }}>Cotlever</a>
        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>Create account</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input className="input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          Have an account? <a href="/login" style={{ color: '#534AB7', fontWeight: 500 }}>Login</a>
        </p>
      </div>
    </main>
  )
}
