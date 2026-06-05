'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function Admin() {
  const [members, setMembers] = useState([])
  const [messages, setMessages] = useState([])
  const [tab, setTab] = useState('members')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (p?.role !== 'admin') { router.push('/members'); return }
      fetchData()
    })
  }, [])

  const fetchData = async () => {
    const { data: m } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const { data: msgs } = await supabase.from('messages').select('*, profiles(name)').order('created_at', { ascending: false }).limit(50)
    setMembers(m || [])
    setMessages(msgs || [])
    setLoading(false)
  }

  const deleteMessage = async (id) => {
    await supabase.from('messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const toggleRole = async (member) => {
    const newRole = member.role === 'admin' ? 'member' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', member.id)
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m))
  }

  const deleteMember = async (id) => {
    if (!confirm('Remove this member?')) return
    await supabase.from('profiles').delete().eq('id', id)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const tabStyle = (t) => ({
    padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
    background: tab === t ? '#534AB7' : '#f0f0f0',
    color: tab === t ? '#fff' : '#555'
  })

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Admin Panel</h1>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button style={tabStyle('members')} onClick={() => setTab('members')}>Members ({members.length})</button>
          <button style={tabStyle('messages')} onClick={() => setTab('messages')}>Messages ({messages.length})</button>
        </div>

        {loading ? <p style={{ color: '#999' }}>Loading...</p> : (
          <>
            {tab === 'members' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {members.map(m => (
                  <div key={m.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{m.name || 'No name'}</div>
                      <div style={{ fontSize: '13px', color: '#888' }}>{m.bio?.slice(0, 60) || '—'}</div>
                    </div>
                    <span style={{
                      fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                      background: m.role === 'admin' ? '#534AB7' : '#f0f0f0',
                      color: m.role === 'admin' ? '#fff' : '#666'
                    }}>{m.role}</span>
                    <button className="btn btn-outline" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => toggleRole(m)}>
                      {m.role === 'admin' ? 'Remove admin' : 'Make admin'}
                    </button>
                    <button className="btn btn-danger" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => deleteMember(m.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'messages' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map(msg => (
                  <div key={msg.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 18px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#534AB7', marginBottom: '4px' }}>{msg.profiles?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '14px' }}>{msg.content}</div>
                      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>{new Date(msg.created_at).toLocaleString()}</div>
                    </div>
                    <button className="btn btn-danger" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => deleteMessage(msg.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
