import { useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Line } from 'react-simple-maps'
import { Activity, Radar, RefreshCw, Globe2, ShieldAlert } from 'lucide-react'
import { fetchThreatMap } from '../../services/threatMap'
import { LoadingDots, ErrorMessage, StatCard } from '../ui'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const MAX_VISIBLE_ROUTES = 20

function severityColor(s) {
  if (s === 'critical') return '#ff4d5a'
  if (s === 'high') return '#ff8a1f'
  if (s === 'medium') return '#29d3ff'
  return '#35e0a1'
}

function severityWeight(s) {
  if (s === 'critical') return 3.4
  if (s === 'high') return 2.7
  if (s === 'medium') return 2.1
  return 1.5
}

function timeAgo(ts) {
  try {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 1000))
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  } catch { return ts }
}

export function ThreatMapTab() {
  const [data, setData] = useState({ total: 0, events: [] })
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  async function loadData({ silent = false } = {}) {
    silent ? setRefreshing(true) : setInitialLoading(true)
    try {
      const response = await fetchThreatMap()
      const safeEvents = Array.isArray(response?.events) ? response.events : []
      setData({ total: response?.total ?? safeEvents.length, events: safeEvents })
      setLastUpdated(response?.generatedAt || new Date().toISOString())
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load threat map data.')
      if (!silent) setData({ total: 0, events: [] })
    } finally {
      setInitialLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(() => loadData({ silent: true }), 5000)
    return () => clearInterval(interval)
  }, [])

  const stats = useMemo(() => {
    const events = Array.isArray(data.events) ? data.events : []
    return {
      total: events.length,
      critical: events.filter(e => e.severity === 'critical').length,
      high: events.filter(e => e.severity === 'high').length,
      attackTypes: new Set(events.map(e => e.attackType)).size
    }
  }, [data])

  const renderedEvents = Array.isArray(data.events) ? data.events.slice(0, MAX_VISIBLE_ROUTES) : []

  return (
    <div className="flex flex-col h-full bg-bg overflow-hidden">
      <div className="p-4 border-b border-border flex gap-3 flex-wrap">
        <StatCard label="Threat Events" value={stats.total} accent />
        <StatCard label="Critical" value={stats.critical} />
        <StatCard label="High" value={stats.high} />
        <StatCard label="Attack Types" value={stats.attackTypes} />
      </div>
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs font-mono text-muted flex items-center gap-2">
          <Radar size={14} className="text-accent" />
          <span className="text-accent">LIVE THREAT ACTIVITY</span>
          <span>· Curated hotspot telemetry</span>
          {refreshing && <span className="text-accent">· syncing...</span>}
        </div>
        <button onClick={() => loadData({ silent: true })} disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded text-xs font-mono text-muted hover:text-accent hover:border-accent/50 transition-colors disabled:opacity-50">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[2.45fr_1fr] gap-0 flex-1 min-h-0 overflow-hidden">
        <div className="border-r border-border p-4 min-h-[640px] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          {initialLoading ? (
            <div className="flex justify-center py-12 relative z-10"><LoadingDots label="Loading threat activity" /></div>
          ) : error && renderedEvents.length === 0 ? (
            <div className="relative z-10"><ErrorMessage message={error} onRetry={() => loadData()} /></div>
          ) : (
            <div className="relative z-10 w-full h-full bg-background rounded overflow-hidden border border-border/60">
              <div className="absolute top-3 left-3 z-20 px-3 py-2 rounded border border-accent/30 bg-surface/80 backdrop-blur text-xs font-mono text-muted flex items-center gap-2">
                <Globe2 size={13} className="text-accent" />Global hotspot map
              </div>
              <ComposableMap projectionConfig={{ scale: 155 }} style={{ width: '100%', height: '100%' }}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#0b1220" stroke="#22314a" strokeWidth={0.55}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none', fill: '#112038' }, pressed: { outline: 'none' } }} />
                  ))}
                </Geographies>
                {renderedEvents.map(event => {
                  const src = event.sourceCoords
                  const dst = event.targetCoords
                  if (!Array.isArray(src) || !Array.isArray(dst)) return null
                  const color = severityColor(event.severity)
                  return (
                    <g key={event.id}>
                      <Line from={src} to={dst} stroke={color} strokeWidth={severityWeight(event.severity)}
                        strokeLinecap="round" className="attack-line-pro"
                        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
                    </g>
                  )
                })}
              </ComposableMap>
            </div>
          )}
        </div>
        <div className="p-4 overflow-y-auto bg-surface/20">
          <div className="flex items-center gap-2 text-xs font-mono text-muted mb-3">
            <Activity size={14} className="text-accent" />Live event stream
          </div>
          <div className="space-y-2">
            {renderedEvents.map(event => {
              const color = severityColor(event.severity)
              return (
                <div key={event.id} className="border border-border bg-card rounded p-3 fade-in hover:border-accent/30 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-mono font-bold text-text">{event.sourceCountry} <span className="text-muted">→</span> {event.targetCountry}</div>
                    <div className="text-[10px] font-mono text-muted">{timeAgo(event.timestamp)}</div>
                  </div>
                  <div className="mt-2 text-sm text-text">{event.attackType}</div>
                  <div className="mt-2 text-[11px] font-mono text-muted">{event.sourceLabel} → {event.targetLabel}</div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded border" style={{ color, borderColor: `${color}55`, backgroundColor: `${color}10` }}>{event.severity?.toUpperCase()}</span>
                    <span className="text-muted">{event.sourceIP}</span>
                  </div>
                </div>
              )
            })}
            {!initialLoading && !error && renderedEvents.length === 0 && (
              <div className="text-center py-12 text-muted text-sm font-mono border border-border rounded bg-card">No threat events available</div>
            )}
          </div>
          <div className="mt-4 border border-danger/20 bg-danger/5 rounded p-3">
            <div className="flex items-center gap-2 text-xs font-mono text-danger mb-2"><ShieldAlert size={13} />Professional demo mode</div>
            <p className="text-xs text-text/70 font-mono leading-5">This map uses curated simulated hotspots for a cleaner threat intelligence presentation.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
