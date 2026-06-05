'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function Members() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) router.push('/login')
    })
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }

  const colors = ['#EEEDFE', '#E1F5EE', '#FAECE7', '#E6F1FB', '#FAEEDA', '#FBEAF0']
  const textColors = ['#3C3489', '#0F6E56', '#993C1D', '#0C447C', '#854F0B', '#72243E']

  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?'
  const colorIndex = (name) => (name?.charCodeAt(0) || 0) % colors.length

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.bio?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Members <span style={{ color: '#999', fontWeight: 400, fontSize: '16px' }}>· {members.length} total</span></h1>
          <input className="input" style={{ maxWidth: '240px' }} placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {filtered.map(member => (
              <div key={member.id} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: colors[colorIndex(member.name)],
                  color: textColors[colorIndex(member.name)],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '17px', margin: '0 auto 12px'
                }}>
                  {getInitials(member.name)}
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{member.name || 'Unknown'}</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', minHeight: '16px' }}>{member.bio?.slice(0, 40) || ''}</div>
                <span style={{
                  fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                  background: member.role === 'admin' ? '#534AB7' : '#f0f0f0',
                  color: member.role === 'admin' ? '#fff' : '#666',
                  fontWeight: 500
                }}>{member.role}</span>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No members found.</p>
        )}
      </main>
    </>
  )
}
