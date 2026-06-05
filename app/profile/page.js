'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
      setName(p?.name || '')
      setBio(p?.bio || '')
    })
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ name, bio }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const colors = ['#EEEDFE', '#E1F5EE', '#FAECE7', '#E6F1FB', '#FAEEDA', '#FBEAF0']
  const textColors = ['#3C3489', '#0F6E56', '#993C1D', '#0C447C', '#854F0B', '#72243E']
  const colorIndex = (n) => (n?.charCodeAt(0) || 0) % colors.length

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '28px' }}>My Profile</h1>
        {profile && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: colors[colorIndex(name)],
                color: textColors[colorIndex(name)],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '20px'
              }}>{name?.slice(0, 2).toUpperCase() || '?'}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{name || 'Your Name'}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>{profile.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Display Name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Bio</label>
                <textarea className="input" rows={3} value={bio} onChange={e => setBio(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <button className="btn btn-primary" onClick={saveProfile} disabled={saving} style={{ width: '100%', padding: '12px' }}>
                {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
