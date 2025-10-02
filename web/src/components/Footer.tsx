export default function Footer() {
  return (
    <footer style={{
      marginTop: 64,
      padding: '24px',
      borderTop: '1px solid var(--line)',
      color: 'var(--text-secondary)',
      background: 'var(--surface-1)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/favicon.png" alt="BeaverNorth Advisors" style={{ height: 24, width: 24, objectFit: 'contain' }} />
          <span>© {new Date().getFullYear()} BeaverNorth Advisors</span>
        </div>
        <div style={{ fontSize: 14 }}>Canada‑based insurance advisory</div>
      </div>
    </footer>
  )
}


