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

  const covers = [
    'linear-gradient(135deg,#1a1060,#3C3489)',
    'linear-gradient(135deg,#082818,#0F6E56)',
    'linear-gradient(135deg,#3d1000,#993C1D)',
    'linear-gradient(135deg,#1a0030,#993556)',
    'linear-gradient(135deg,#001a3d,#185FA5)',
    'linear-gradient(135deg,#1a1200,#854F0B)',
  ]
  const avatarBg = ['#EEEDFE','#E1F5EE','#FAECE7','#FBEAF0','#E6F1FB','#FAEEDA']
  const avatarText = ['#3C3489','#085041','#712B13','#72243E','#0C447C','#633806']

  const colorIndex = (name) => (name?.charCodeAt(0) || 0) % covers.length
  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?'

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.bio?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #00000a; }
        .members-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 88px 20px 40px;
        }
        .members-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .members-title {
          color: #fff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .members-title span {
          color: rgba(200,210,255,0.4);
          font-size: 14px;
          font-weight: 400;
          margin-left: 8px;
        }
        .members-search {
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 16px;
          color: rgba(200,210,255,0.8);
          font-size: 13px;
          width: 220px;
          outline: none;
        }
        .members-search::placeholder { color: rgba(200,210,255,0.3); }
        .members-search:focus { border-color: rgba(255,255,255,0.25); }
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .member-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .member-card:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .member-cover {
          height: 70px;
        }
        .member-body {
          padding: 0 16px 18px;
        }
        .member-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 17px;
          margin-top: -27px;
          border: 3px solid #00000a;
        }
        .member-name {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          margin: 10px 0 4px;
        }
        .member-bio {
          color: rgba(200,210,255,0.45);
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 14px;
          min-height: 36px;
        }
        .member-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .follow-btn {
          font-size: 12px;
          color: rgba(200,210,255,0.7);
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          padding: 5px 14px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .follow-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .loading {
          color: rgba(200,210,255,0.4);
          text-align: center;
          padding: 60px;
          font-size: 14px;
        }
        .empty {
          color: rgba(200,210,255,0.3);
          text-align: center;
          padding: 60px;
          font-size: 14px;
        }
      `}</style>

      <Navbar />

      <main className="members-wrap">
        <div className="members-top">
          <h1 className="members-title">
            Members
            <span>· {members.length} total</span>
          </h1>
          <input
            className="members-search"
            placeholder="Search members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="members-grid">
            {filtered.map(member => {
              const idx = colorIndex(member.name)
              return (
                <div
                  key={member.id}
                  className="member-card"
                  onClick={() => router.push(`/profile/${member.id}`)}
                >
                  <div className="member-cover" style={{ background: covers[idx] }} />
                  <div className="member-body">
                    <div
                      className="member-avatar"
                      style={{ background: avatarBg[idx], color: avatarText[idx] }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="member-name">{member.name || 'Unknown'}</div>
                    <div className="member-bio">{member.bio?.slice(0, 60) || 'No bio yet.'}</div>
                    <div className="member-footer">
                      <button className="follow-btn">Follow</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="empty">No members found.</p>
        )}
      </main>
    </>
  )
}
