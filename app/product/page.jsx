// app/product/page.jsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', type: 'physical' })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) router.push('/login')
      else setUser(data.user)
    })
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!form.name || !form.price) return
    setSubmitting(true)
    const { error } = await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      price: form.price,
      type: form.type,
      user_id: user.id,
    })
    if (!error) {
      setShowModal(false)
      setForm({ name: '', description: '', price: '', type: 'physical' })
      fetchProducts()
    }
    setSubmitting(false)
  }

  const typeEmoji = (type) => type === 'digital' ? '📊' : '📦'

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'mine' ? p.user_id === user?.id :
      p.type === filter
    return matchSearch && matchFilter
  })

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000008; }
        .page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 88px 20px 48px;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .title { color: #fff; font-size: 20px; font-weight: 700; }
        .title span { color: rgba(100,200,255,0.4); font-size: 14px; font-weight: 400; margin-left: 8px; }
        .top-right { display: flex; gap: 10px; align-items: center; }
        .search {
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 14px;
          color: rgba(200,210,255,0.8);
          font-size: 13px;
          width: 200px;
          outline: none;
        }
        .search::placeholder { color: rgba(200,210,255,0.3); }
        .add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(100,200,255,0.1);
          border: 0.5px solid rgba(100,200,255,0.3);
          color: #64c8ff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .add-btn:hover { background: rgba(100,200,255,0.18); }
        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .filt {
          font-size: 12px;
          padding: 5px 14px;
          border-radius: 20px;
          border: 0.5px solid rgba(255,255,255,0.1);
          color: rgba(200,210,255,0.5);
          cursor: pointer;
          background: transparent;
          transition: all 0.2s;
        }
        .filt:hover { border-color: rgba(255,255,255,0.2); color: rgba(200,210,255,0.8); }
        .filt.active {
          background: rgba(100,200,255,0.1);
          border-color: rgba(100,200,255,0.3);
          color: #64c8ff;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .card {
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
        }
        .card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .card-img {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        .card-body { padding: 12px 16px 16px; }
        .badge {
          display: inline-block;
          font-size: 10px;
          padding: 2px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .badge-physical { background: #0F2A1A; color: #5DCAA5; }
        .badge-digital { background: #1a1060; color: #AFA9EC; }
        .card-name { color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .card-desc { color: rgba(200,210,255,0.4); font-size: 12px; margin-bottom: 12px; line-height: 1.5; min-height: 32px; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; }
        .price { color: #64c8ff; font-size: 14px; font-weight: 600; }
        .owner { display: flex; align-items: center; gap: 6px; }
        .owner-av {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; color: rgba(200,210,255,0.8);
        }
        .owner-name { color: rgba(200,210,255,0.4); font-size: 11px; }
        .empty { color: rgba(200,210,255,0.3); text-align: center; padding: 60px; font-size: 14px; }
        .loading { color: rgba(200,210,255,0.3); text-align: center; padding: 60px; font-size: 14px; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal {
          background: #0a0a1e;
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 28px;
          width: 100%;
          max-width: 440px;
        }
        .modal h2 { color: #fff; font-size: 16px; font-weight: 700; margin-bottom: 20px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 12px; color: rgba(200,210,255,0.5); margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
        .field input, .field textarea, .field select {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input:focus, .field textarea:focus, .field select:focus {
          border-color: rgba(100,200,255,0.4);
        }
        .field textarea { resize: none; height: 80px; }
        .field select option { background: #0a0a1e; }
        .modal-footer { display: flex; gap: 10px; margin-top: 20px; }
        .btn-cancel {
          flex: 1; padding: 10px; border-radius: 8px;
          background: transparent; border: 0.5px solid rgba(255,255,255,0.15);
          color: rgba(200,210,255,0.6); cursor: pointer; font-size: 13px;
          transition: background 0.2s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.05); }
        .btn-submit {
          flex: 1; padding: 10px; border-radius: 8px;
          background: rgba(100,200,255,0.15);
          border: 0.5px solid rgba(100,200,255,0.3);
          color: #64c8ff; cursor: pointer; font-size: 13px;
          transition: background 0.2s;
        }
        .btn-submit:hover { background: rgba(100,200,255,0.25); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .grid { grid-template-columns: 1fr; }
          .search { width: 140px; }
        }
      `}</style>

      <Navbar />

      <main className="page">
        <div className="top">
          <h1 className="title">
            Products
            <span>· {products.length} total</span>
          </h1>
          <div className="top-right">
            <input
              className="search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="add-btn" onClick={() => setShowModal(true)}>
              + Add Product
            </button>
          </div>
        </div>

        <div className="filters">
          {[
            { key: 'all', label: 'All' },
            { key: 'physical', label: 'Physical' },
            { key: 'digital', label: 'Digital' },
            { key: 'mine', label: 'My Products' },
          ].map(f => (
            <button
              key={f.key}
              className={`filt ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="grid">
            {filtered.map(p => (
              <div key={p.id} className="card">
                <div
                  className="card-img"
                  style={{ background: p.type === 'digital' ? 'rgba(83,74,183,0.12)' : 'rgba(15,110,86,0.12)' }}
                >
                  {typeEmoji(p.type)}
                </div>
                <div className="card-body">
                  <span className={`badge ${p.type === 'digital' ? 'badge-digital' : 'badge-physical'}`}>
                    {p.type}
                  </span>
                  <div className="card-name">{p.name}</div>
                  <div className="card-desc">{p.description?.slice(0, 65) || 'No description.'}</div>
                  <div className="card-footer">
                    <span className="price">৳ {p.price}</span>
                    <div className="owner">
                      <div className="owner-av">
                        {p.profiles?.name?.slice(0, 2).toUpperCase() || '?'}
                      </div>
                      <span className="owner-name">{p.profiles?.name?.split(' ')[0] || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="empty">No products found.</p>
        )}
      </main>

      {/* Add Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Add Product</h2>
            <div className="field">
              <label>Name</label>
              <input
                placeholder="Product name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                placeholder="Short description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Price (৳)</label>
              <input
                placeholder="e.g. 450"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleAdd} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
