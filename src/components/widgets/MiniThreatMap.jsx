import { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography, Line } from 'react-simple-maps'
import { fetchThreatMap } from '../../services/threatMap'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function MiniThreatMap({ onOpen }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchThreatMap()
        setEvents(Array.isArray(res?.events) ? res.events.slice(0, 12) : [])
      } catch { setEvents([]) }
    }
    load()
  }, [])

  return (
    <div className="border border-border rounded bg-card mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border text-xs font-mono">
        <span className="text-accent">Global Threat Snapshot</span>
        <button onClick={onOpen} className="text-accent hover:underline">Open Map →</button>
      </div>
      <div style={{ height: '280px' }}>
        <ComposableMap projectionConfig={{ scale: 240 }} style={{ width: '100%', height: '100%' }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) => geographies.map(geo => (
              <Geography key={geo.rsmKey} geography={geo} fill="#0b1220" stroke="#22314a" strokeWidth={0.5}
                style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }} />
            ))}
          </Geographies>
          {events.map(e => {
            const src = e.sourceCoords
            const dst = e.targetCoords
            if (!src || !dst) return null
            return (
              <Line key={e.id} from={src} to={dst} stroke="#22d3ee"
                strokeWidth={2} className="attack-line-pro"
                style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
            )
          })}
        </ComposableMap>
      </div>
    </div>
  )
}
