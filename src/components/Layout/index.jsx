import { Shield, Zap, Brain, Radio, FileText, Activity, Globe, Menu, X } from 'lucide-react'

export const TABS = [
  { id: 'cve',     label: 'CVE Feed',     icon: Activity, desc: 'NVD vulnerability stream' },
  { id: 'kev',     label: 'CISA KEV',     icon: Zap,      desc: 'Known exploited vulnerabilities' },
  { id: 'analyst', label: 'AI Analyst',   icon: Brain,    desc: 'Claude-powered threat analysis' },
  { id: 'intel',   label: 'Threat Intel', icon: Radio,    desc: 'CVE detail and context' },
  { id: 'map',     label: 'Threat Map',   icon: Globe,    desc: 'Simulated global threat activity' },
  { id: 'reports', label: 'Reports',      icon: FileText, desc: 'Exportable threat summaries' },
]

function SidebarContent({ activeTab, onTabChange, onClose }) {
  return (
    <aside className="w-64 md:w-56 shrink-0 border-r border-border bg-surface flex flex-col h-full">
      <div className="p-5 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-accent" />
            <span className="font-display font-bold text-accent glow-text tracking-wider text-sm">
              CIPHER<span className="text-text">MIND</span>
            </span>
          </div>
          <div className="text-muted text-xs mt-1 font-mono">v1.1.0 · Security Hardened</div>
        </div>
        <button onClick={onClose} className="md:hidden text-muted hover:text-text transition-colors">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-muted text-xs font-mono px-2 mb-3">// MODULES</div>
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => { onTabChange(tab.id); onClose?.() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all duration-150 group ${active ? 'bg-accent/10 border border-accent/30 text-accent' : 'text-muted hover:text-text hover:bg-card border border-transparent'}`}>
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

export function Sidebar({ activeTab, onTabChange, mobileOpen, onClose }) {
  return (
    <>
      <div className="hidden md:flex h-full">
        <SidebarContent activeTab={activeTab} onTabChange={onTabChange} />
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="relative z-10 h-full">
            <SidebarContent activeTab={activeTab} onTabChange={onTabChange} onClose={onClose} />
          </div>
        </div>
      )}
    </>
  )
}

export function Header({ activeTab, lastUpdated, kevTotal, onOpenMenu }) {
  const tab = TABS.find(t => t.id === activeTab)
  const Icon = tab?.icon
  return (
    <header className="border-b border-border bg-surface px-4 md:px-6 py-3 flex items-center justify-between shrink-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenMenu} className="md:hidden text-muted hover:text-text transition-colors">
          <Menu size={18} />
        </button>
        {Icon && <Icon size={16} className="text-accent shrink-0" />}
        <div className="min-w-0">
          <h1 className="text-sm font-mono font-bold text-text truncate">{tab?.label}</h1>
          <p className="text-xs text-muted hidden sm:block truncate">{tab?.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-muted shrink-0">
        {kevTotal > 0 && <span className="text-danger hidden sm:inline">⚡ {kevTotal.toLocaleString()} KEV entries</span>}
        {lastUpdated && <span className="hidden lg:inline">Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
        <span className="text-accent">● LIVE</span>
      </div>
    </header>
  )
}
