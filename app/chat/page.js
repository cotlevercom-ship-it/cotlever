'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [user, setUser] = useState(null)
  const [profiles, setProfiles] = useState({})
  const bottomRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { router.push('/login'); return }
      setUser(data.user)
    })
    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new])
        fetchProfiles()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true }).limit(100)
    setMessages(data || [])
    fetchProfiles()
  }

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id, name')
    if (data) {
      const map = {}
      data.forEach(p => { map[p.id] = p })
      setProfiles(map)
    }
  }

  const sendMessage = async () => {
    if (!newMsg.trim() || !user) return
    await supabase.from('messages').insert({ user_id: user.id, content: newMsg.trim() })
    setNewMsg('')
  }

  const colors = ['#EEEDFE', '#E1F5EE', '#FAECE7', '#E6F1FB', '#FAEEDA', '#FBEAF0']
  const textColors = ['#3C3489', '#0F6E56', '#993C1D', '#0C447C', '#854F0B', '#72243E']
  const colorIndex = (name) => (name?.charCodeAt(0) || 0) % colors.length
  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?'

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>General Chat</h1>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee', marginBottom: '12px' }}>
          {messages.map(msg => {
            const sender = profiles[msg.user_id]
            const isMe = msg.user_id === user?.id
            return (
              <div key={msg.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: colors[colorIndex(sender?.name)],
                  color: textColors[colorIndex(sender?.name)],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700
                }}>{getInitials(sender?.name)}</div>
                <div style={{ maxWidth: '65%' }}>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '3px', textAlign: isMe ? 'right' : 'left' }}>
                    {isMe ? 'You' : (sender?.name || 'Unknown')}
                  </div>
                  <div style={{
                    background: isMe ? '#534AB7' : '#f3f3f3',
                    color: isMe ? '#fff' : '#1a1a1a',
                    padding: '8px 12px', borderRadius: isMe ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                    fontSize: '14px', lineHeight: 1.5
                  }}>{msg.content}</div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            className="input"
            placeholder="Type a message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={sendMessage} style={{ padding: '10px 20px' }}>Send</button>
        </div>
      </main>
    </>
  )
}
