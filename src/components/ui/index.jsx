export function SeverityBadge({ severity }) {
  const s = (severity || 'NONE').toUpperCase()
  const cls = { CRITICAL: 'severity-critical', HIGH: 'severity-high', MEDIUM: 'severity-medium', LOW: 'severity-low', NONE: 'severity-none' }[s] || 'severity-none'
  return <span className={`text-xs font-mono border px-2 py-0.5 rounded ${cls}`}>{s}</span>
}

export function KevBadge() {
  return <span className="text-xs font-mono border px-2 py-0.5 rounded text-danger border-danger/40 bg-danger/10 animate-pulse_slow">⚡ KEV</span>
}

export function ScoreDisplay({ score }) {
  if (!score) return <span className="text-muted text-xs">N/A</span>
  const color = score >= 9.0 ? 'text-danger' : score >= 7.0 ? 'text-warn' : score >= 4.0 ? 'text-yellow-400' : 'text-accent'
  return <span className={`font-mono font-bold text-sm ${color}`}>{score.toFixed(1)}</span>
}

export function LoadingDots({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-2 text-muted text-sm font-mono">
      <span>{label}</span>
      <span className="dot-1 text-accent">.</span>
      <span className="dot-2 text-accent">.</span>
      <span className="dot-3 text-accent">.</span>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="border border-danger/30 bg-danger/5 rounded p-4 font-mono text-sm">
      <div className="text-danger mb-1">⚠ ERROR</div>
      <div className="text-text/70">{message}</div>
      {onRetry && <button onClick={onRetry} className="mt-3 text-xs text-accent hover:underline">→ retry</button>}
    </div>
  )
}

export function CVECard({ cve, isKev, onClick }) {
  const truncated = cve.description.length > 160 ? cve.description.slice(0, 160) + '...' : cve.description
  return (
    <div onClick={() => onClick?.(cve)} className="card-glow border border-border bg-card rounded p-4 cursor-pointer transition-all duration-200 hover:border-accent/30 fade-in">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-accent font-mono text-sm font-bold">{cve.id}</span>
          <SeverityBadge severity={cve.severity} />
          {isKev && <KevBadge />}
        </div>
        <ScoreDisplay score={cve.score} />
      </div>
      <p className="text-text/70 text-xs leading-relaxed">{truncated}</p>
      <div className="mt-2 text-muted text-xs">{new Date(cve.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
    </div>
  )
}

export function StatCard({ label, value, accent = false }) {
  return (
    <div className="border border-border bg-card rounded px-4 py-3 min-w-[120px]">
      <div className={`text-xl font-bold font-mono ${accent ? 'text-accent glow-text' : 'text-text'}`}>{value}</div>
      <div className="text-muted text-xs mt-0.5">{label}</div>
    </div>
  )
}
