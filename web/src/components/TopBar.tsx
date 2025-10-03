export default function TopBar() {
  // Slim accent bar that scrolls away; main Nav remains sticky
  return (
    <div style={{
      width: '100%',
      height: 8,
      background: 'linear-gradient(90deg, var(--brand-green), var(--brand-yellow), var(--brand-orange))'
    }} />
  )
}


