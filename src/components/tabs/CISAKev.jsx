import { useState } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import { filterKevEntries } from '../../services/cisa'
import { LoadingDots, ErrorMessage, StatCard } from '../ui'

export function CISAKevTab({ kevData, loading, error, onRefresh }) {
  const [search, setSearch] = useState('')
  const filtered       = filterKevEntries(kevData.entries, search)
  const ransomwareCount = kevData.entries.filter(e => e.knownRansomware).length
  const thirtyDaysAgo  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentCount    = kevData.entries.filter(e => new Date(e.dateAdded) > thirtyDaysAgo).length

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex gap-3 flex-wrap">
        <StatCard label="Total KEV"   value={kevData.total}   accent />
        <StatCard label="Ransomware"  value={ransomwareCount} />
        <StatCard label="Added (30d)" value={recentCount}     />
      </div>
      <div className="mx-4 mt-4 p-3 border border-danger/30 bg-danger/5 rounded flex gap-2">
        <AlertTriangle size={14} className="text-danger mt-0.5 shrink-0" />
        <p className="text-xs font-mono text-text/70">CISA KEV lists vulnerabilities with confirmed active exploitation. Prioritize patching above CVSS-only triage.</p>
      </div>
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search}
            onChange={e => setSearch(e.target.value.replace(/[<>'"]/g, '').slice(0, 100))}
            placeholder="Search vendor, product, or CVE ID..."
            className="w-full bg-card border border-border rounded px-3 py-2 pl-9 text-xs font-mono text-text placeholder-muted focus:outline-none focus:border-accent/50 transition-colors" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && <div className="flex justify-center py-12"><LoadingDots label="Fetching CISA KEV" /></div>}
        {error && !loading && <ErrorMessage message={error} onRetry={onRefresh} />}
        {!loading && !error && (
          <div className="space-y-2">
            {filtered.slice(0, 100).map(entry => <KevEntry key={entry.id} entry={entry} />)}
            {filtered.length > 100 && <div className="text-center text-muted text-xs font-mono py-4">Showing 100 of {filtered.length} entries</div>}
          </div>
        )}
      </div>
    </div>
  )
}

function KevEntry({ entry }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div onClick={() => setExpanded(!expanded)} className="border border-border bg-card rounded p-3 cursor-pointer hover:border-danger/30 transition-colors fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-danger font-mono text-sm font-bold">{entry.id}</span>
          {entry.knownRansomware && <span className="text-xs border border-danger/40 bg-danger/10 text-danger px-2 py-0.5 rounded font-mono">🔴 RANSOMWARE</span>}
        </div>
        <span className="text-muted text-xs font-mono shrink-0">{entry.dateAdded}</span>
      </div>
      <div className="mt-1 text-text/80 text-xs font-mono">{entry.vendorProject} — {entry.product}</div>
      <div className="mt-1 text-text/60 text-xs">{entry.name}</div>
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <div><span className="text-muted text-xs font-mono">// description</span><p className="text-text/70 text-xs mt-1">{entry.shortDesc}</p></div>
          <div><span className="text-muted text-xs font-mono">// required action</span><p className="text-accent text-xs mt-1">{entry.requiredAction}</p></div>
          <div className="text-xs font-mono"><span className="text-muted">Due date: </span><span className="text-warn">{entry.dueDate}</span></div>
        </div>
      )}
    </div>
  )
}
