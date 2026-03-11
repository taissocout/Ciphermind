import { useState } from 'react'
import { Search, ExternalLink, Zap } from 'lucide-react'
import { fetchCVEById } from '../../services/nvd'
import { analyzeCVE } from '../../services/claude'
import { SeverityBadge, KevBadge, ScoreDisplay, LoadingDots } from '../ui'

export function ThreatIntelTab({ kevIds }) {
  const [query,    setQuery]    = useState('')
  const [cveData,  setCveData]  = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [loading,  setLoading]  = useState({ cve: false, ai: false })
  const [error,    setError]    = useState(null)

  const handleSearch = async () => {
    const id = query.trim().toUpperCase()
    if (!/^CVE-\d{4}-\d{4,}$/.test(id)) { setError('Invalid CVE format. Use: CVE-YYYY-NNNNN'); return }
    setLoading({ cve: true, ai: false }); setError(null); setCveData(null); setAnalysis('')
    try {
      const data = await fetchCVEById(id)
      setCveData(data)
      setLoading({ cve: false, ai: true })
      const aiText = await analyzeCVE(data, kevIds.has(id))
      setAnalysis(aiText)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading({ cve: false, ai: false })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="text-xs font-mono text-muted mb-3">Enter a CVE ID to get detailed intel and AI analysis</div>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" value={query}
              onChange={e => setQuery(e.target.value.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase().slice(0, 20))}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="CVE-2024-12345"
              className="w-full bg-card border border-border rounded px-3 py-2 pl-9 text-xs font-mono text-text placeholder-muted uppercase focus:outline-none focus:border-accent/50 transition-colors" />
          </div>
          <button onClick={handleSearch} disabled={!query || loading.cve}
            className="px-4 py-2 bg-accent/10 border border-accent/30 rounded text-accent text-xs font-mono hover:bg-accent/20 transition-colors disabled:opacity-40 flex items-center gap-2">
            <Zap size={12} /> Analyze
          </button>
        </div>
        {error && <p className="mt-2 text-danger text-xs font-mono">{error}</p>}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading.cve && <LoadingDots label="Fetching CVE data" />}
        {cveData && (
          <div className="space-y-4 fade-in">
            <div className="border border-border bg-card rounded p-4">
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <span className="text-accent font-mono font-bold">{cveData.id}</span>
                <SeverityBadge severity={cveData.severity} />
                {kevIds.has(cveData.id) && <KevBadge />}
                <ScoreDisplay score={cveData.score} />
              </div>
              <p className="text-text/80 text-xs leading-relaxed">{cveData.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div><span className="text-muted">Published: </span><span>{cveData.published?.slice(0, 10)}</span></div>
                <div><span className="text-muted">Modified: </span><span>{cveData.modified?.slice(0, 10)}</span></div>
                {cveData.cvssVector && <div className="col-span-2"><span className="text-muted">Vector: </span><span className="text-accent2">{cveData.cvssVector}</span></div>}
              </div>
              {cveData.references?.length > 0 && (
                <div className="mt-3">
                  <div className="text-muted text-xs font-mono mb-1">// references</div>
                  {cveData.references.map((ref, i) => (
                    <a key={i} href={ref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent2 hover:underline">
                      <ExternalLink size={10} /><span className="truncate">{ref}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="border border-accent2/30 bg-accent2/5 rounded p-4">
              <div className="text-accent2 text-xs font-mono font-bold mb-3">⚡ AI ANALYST ASSESSMENT</div>
              {loading.ai && <LoadingDots label="Generating analysis" />}
              {analysis && <div className="text-text/80 text-xs font-mono leading-relaxed whitespace-pre-wrap">{analysis}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ReportsTab({ cves, kevData, kevIds }) {
  const generateReport = () => {
    const critical  = cves.filter(c => c.severity === 'CRITICAL')
    const inKev     = cves.filter(c => kevIds.has(c.id))
    const timestamp = new Date().toISOString()
    const report = `# CipherMind Threat Intelligence Report\nGenerated: ${timestamp}\n\n## Summary\n- CVEs analyzed: ${cves.length}\n- Critical: ${critical.length}\n- In CISA KEV: ${inKev.length}\n- Total KEV entries: ${kevData.total}\n\n## Critical CVEs\n${critical.slice(0, 10).map(c => `### ${c.id} (Score: ${c.score || 'N/A'})\n${kevIds.has(c.id) ? '⚡ CISA KEV\n' : ''}${c.description.slice(0, 200)}...`).join('\n\n')}\n\n## CISA KEV Highlights\n${kevData.entries.slice(0, 10).map(e => `- ${e.id} | ${e.vendorProject} — ${e.product}${e.knownRansomware ? ' [RANSOMWARE]' : ''}`).join('\n')}\n\n---\n*CipherMind · github.com/taissocout/ciphermind*`
    const blob = new Blob([report], { type: 'text/markdown' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `ciphermind-report-${timestamp.slice(0, 10)}.md`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="max-w-2xl space-y-4">
        <div className="text-xs font-mono text-muted mb-6">Generate and export threat intelligence reports from current session data.</div>
        <div className="border border-border bg-card rounded p-5">
          <div className="text-accent font-mono font-bold mb-1">Threat Intelligence Report</div>
          <div className="text-text/60 text-xs font-mono mb-4">Markdown export with CVE summary, critical findings, and CISA KEV highlights.</div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border border-border rounded p-3 text-center"><div className="text-accent font-bold font-mono text-lg">{cves.length}</div><div className="text-muted text-xs">CVEs</div></div>
            <div className="border border-border rounded p-3 text-center"><div className="text-danger font-bold font-mono text-lg">{cves.filter(c => c.severity === 'CRITICAL').length}</div><div className="text-muted text-xs">Critical</div></div>
            <div className="border border-border rounded p-3 text-center"><div className="text-warn font-bold font-mono text-lg">{cves.filter(c => kevIds.has(c.id)).length}</div><div className="text-muted text-xs">KEV Matches</div></div>
          </div>
          <button onClick={generateReport} disabled={cves.length === 0}
            className="w-full py-2.5 bg-accent/10 border border-accent/30 rounded text-accent text-xs font-mono font-bold hover:bg-accent/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            ↓ Export Markdown Report
          </button>
        </div>
        <div className="text-muted text-xs font-mono">// Phase 2: PDF export, scheduled reports, email delivery</div>
      </div>
    </div>
  )
}
