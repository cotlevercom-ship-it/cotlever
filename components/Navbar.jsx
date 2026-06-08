export default function Navbar() {
  return (
    <>
      <style>{`
        .logo-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0;
          cursor: pointer;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 2px;
          font-family: inherit;
        }
        .logo-cot {
          display: inline-block;
          color: white;
        }
        .logo-lever {
          display: inline-block;
          color: white;
          animation: leverSlide 3s ease-in-out infinite;
          transform-origin: left center;
        }
        @keyframes leverSlide {
          0%   { transform: translateX(0px); }
          30%  { transform: translateX(0px); }
          45%  { transform: translateX(12px); }
          65%  { transform: translateX(12px); }
          85%  { transform: translateX(0px); }
          100% { transform: translateX(0px); }
        }
        .logo-gleam {
          position: absolute;
          inset: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 2px;
          background-image: linear-gradient(90deg, transparent 30%, #ff0000 45%, #ff6060 50%, #ff0000 55%, transparent 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 100%;
          animation: gleam 3s ease-in-out infinite;
        }
        @keyframes gleam {
          0%   { background-position: 200% 0; }
          45%  { background-position: 50% 0; }
          100% { background-position: -100% 0; }
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
        }
        .login-btn {
          color: white;
          background: transparent;
          border: 1px solid white;
          padding: 8px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
        }
        .login-btn:hover {
          background: white;
          color: black;
        }
      `}</style>

      <nav className="navbar">
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div className="logo-wrapper">
              <span className="logo-cot">COT</span>
              <span className="logo-lever">LEVER</span>
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <span className="logo-gleam">COTLEVER</span>
            </div>
          </div>
        </a>

        <a href="/login" className="login-btn">Login</a>
      </nav>
    </>
  )
}
