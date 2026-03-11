import { Shield, Zap, Brain, Radio, FileText, Activity } from 'lucide-react'

export const TABS = [
  { id: 'cve',     label: 'CVE Feed',     icon: Activity, desc: 'NVD vulnerability stream'        },
  { id: 'kev',     label: 'CISA KEV',     icon: Zap,      desc: 'Known exploited vulnerabilities' },
  { id: 'analyst', label: 'AI Analyst',   icon: Brain,    desc: 'Claude-powered threat analysis'  },
  { id: 'intel',   label: 'Threat Intel', icon: Radio,    desc: 'CVE detail and context'           },
  { id: 'reports', label: 'Reports',      icon: FileText, desc: 'Exportable threat summaries'     },
]

export function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-accent" />
          <span className="font-display font-bold text-accent glow-text tracking-wider text-sm">
            CIPHER<span className="text-text">MIND</span>
          </span>
        </div>
        <div className="text-muted text-xs mt-1 font-mono">v1.0.0 · Phase 1</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <div className="text-muted text-xs font-mono px-2 mb-3">// MODULES</div>
        {TABS.map(tab => {
          const Icon   = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all duration-150 group
                ${active ? 'bg-accent/10 border border-accent/30 text-accent' : 'text-muted hover:text-text hover:bg-card border border-transparent'}`}>
              <Icon size={15} className={active ? 'text-accent' : 'text-muted group-hover:text-text'} />
              <span className="text-xs font-mono">{tab.label}</span>
              {active && <span className="ml-auto w-1 h-1 rounded-full bg-accent animate-pulse" />}
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-muted text-xs font-mono space-y-1">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /><span>NVD · Connected</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /><span>CISA KEV · Connected</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse" /><span>Claude API · Ready</span></div>
        </div>
      </div>
    </aside>
  )
}

export function Header({ activeTab, lastUpdated, kevTotal }) {
  const tab  = TABS.find(t => t.id === activeTab)
  const Icon = tab?.icon
  return (
    <header className="border-b border-border bg-surface px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={16} className="text-accent" />}
        <div>
          <h1 className="text-sm font-mono font-bold text-text">{tab?.label}</h1>
          <p className="text-xs text-muted">{tab?.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono text-muted">
        {kevTotal > 0 && <span className="text-danger">⚡ {kevTotal.toLocaleString()} KEV entries</span>}
        {lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
        <span className="text-accent">● LIVE</span>
      </div>
    </header>
  )
}
