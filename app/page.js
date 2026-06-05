import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero_clean.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }} />
      </main>
    </>
  )
}
