import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: '#534AB7', marginBottom: '16px', letterSpacing: '-1px' }}>
            Cotlever
          </div>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
            A modern community platform. Connect, chat, and grow together.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
              Join the community
            </a>
            <a href="/login" className="btn btn-outline" style={{ fontSize: '15px', padding: '12px 28px' }}>
              Login
            </a>
          </div>
          <div style={{ marginTop: '60px', display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '👥', label: 'Member Profiles' },
              { icon: '💬', label: 'Group Chat' },
              { icon: '🔒', label: 'Secure Auth' },
            ].map(f => (
              <div key={f.label} style={{ fontSize: '14px', color: '#666' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{f.icon}</div>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
