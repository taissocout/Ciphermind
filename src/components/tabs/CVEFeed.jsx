import { useState } from 'react'
import { Search, RefreshCw, Filter } from 'lucide-react'
import { CVECard, LoadingDots, ErrorMessage, StatCard } from '../ui'

const SEVERITIES = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export function CVEFeedTab({ cves, kevIds, loading, error, onRefresh }) {
  const [search,   setSearch]   = useState('')
  const [severity, setSeverity] = useState('')

  const filtered = cves.filter(cve => {
    const matchSearch   = !search   || cve.id.toLowerCase().includes(search.toLowerCase()) || cve.description.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = !severity || cve.severity === severity
    return matchSearch && matchSeverity
  })

  const stats = {
    total:    cves.length,
    critical: cves.filter(c => c.severity === 'CRITICAL').length,
    kev:      cves.filter(c => kevIds.has(c.id)).length,
    high:     cves.filter(c => c.severity === 'HIGH').length,
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex gap-3 flex-wrap">
        <StatCard label="Total CVEs"  value={stats.total}    />
        <StatCard label="Critical"    value={stats.critical} accent />
        <StatCard label="High"        value={stats.high}     />
        <StatCard label="In CISA KEV" value={stats.kev}      />
      </div>
      <div className="p-4 border-b border-border flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search}
            onChange={e => setSearch(e.target.value.replace(/[<>'"]/g, '').slice(0, 100))}
            placeholder="Search CVE ID or keyword..."
            className="w-full bg-card border border-border rounded px-3 py-2 pl-9 text-xs font-mono text-text placeholder-muted focus:outline-none focus:border-accent/50 transition-colors" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <select value={severity} onChange={e => setSeverity(e.target.value)}
            className="bg-card border border-border rounded px-3 py-2 pl-9 text-xs font-mono text-text focus:outline-none focus:border-accent/50 transition-colors appearance-none pr-6">
            {SEVERITIES.map(s => <option key={s} value={s}>{s || 'All Severities'}</option>)}
          </select>
        </div>
        <button onClick={() => onRefresh({ keyword: search, severity })} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded text-xs font-mono text-muted hover:text-accent hover:border-accent/50 transition-colors disabled:opacity-50">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && <div className="flex justify-center py-12"><LoadingDots label="Fetching NVD data" /></div>}
        {error && !loading && <ErrorMessage message={error} onRetry={() => onRefresh()} />}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm font-mono"><div className="text-2xl mb-2">∅</div><div>No CVEs found</div></div>
        )}
        {!loading && !error && (
          <div className="space-y-3">
            {filtered.map(cve => <CVECard key={cve.id} cve={cve} isKev={kevIds.has(cve.id)} />)}
          </div>
        )}
      </div>
    </div>
  )
}
