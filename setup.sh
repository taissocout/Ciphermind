#!/bin/bash
# ============================================================
# CipherMind — Setup Script
# Cria toda a estrutura de pastas e arquivos do projeto
# Uso: bash setup.sh (dentro da pasta ciphermind)
# ============================================================

set -e  # Para se qualquer comando falhar

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗██████╗ "
echo " ██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗"
echo " ██║     ██║██████╔╝███████║█████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║██║  ██║"
echo " ██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██║  ██║"
echo " ╚██████╗██║██║     ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██████╔╝"
echo "  ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ "
echo -e "${NC}"
echo -e "${YELLOW}  Phase 1 Setup Script${NC}"
echo ""

# ── 1. Criar estrutura de pastas ──────────────────────────────────────────
echo -e "${GREEN}[1/4] Creating folder structure...${NC}"
mkdir -p src/components/Layout
mkdir -p src/components/tabs
mkdir -p src/components/ui
mkdir -p src/services
mkdir -p src/hooks
echo "  ✓ src/components/Layout"
echo "  ✓ src/components/tabs"
echo "  ✓ src/components/ui"
echo "  ✓ src/services"
echo "  ✓ src/hooks"

# ── 2. Mover arquivos soltos para as pastas corretas ──────────────────────
echo ""
echo -e "${GREEN}[2/4] Moving files to correct locations...${NC}"

move_if_exists() {
  if [ -f "src/$1" ]; then
    mv "src/$1" "src/$2"
    echo "  ✓ src/$1 → src/$2"
  else
    echo "  - src/$1 not found (skipping)"
  fi
}

move_if_exists "nvd.js"    "services/nvd.js"
move_if_exists "cisa.js"   "services/cisa.js"
move_if_exists "claude.js" "services/claude.js"

# ── 3. Criar arquivos que faltam ──────────────────────────────────────────
echo ""
echo -e "${GREEN}[3/4] Creating missing files...${NC}"

# ── index.html ────────────────────────────────────────────────────────────
cat > index.html << 'HEREDOC'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="CipherMind — AI-Powered Cybersecurity Intelligence Platform" />
    <title>CipherMind</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HEREDOC
echo "  ✓ index.html"

# ── vite.config.js ────────────────────────────────────────────────────────
cat > vite.config.js << 'HEREDOC'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nvd': {
        target: 'https://services.nvd.nist.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nvd/, '')
      },
      '/api/cisa': {
        target: 'https://www.cisa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cisa/, '')
      }
    }
  }
})
HEREDOC
echo "  ✓ vite.config.js"

# ── tailwind.config.js ────────────────────────────────────────────────────
cat > tailwind.config.js << 'HEREDOC'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0e1a',
        surface: '#0f1626',
        card:    '#141c2e',
        border:  '#1e2d4a',
        accent:  '#00ff88',
        accent2: '#00c4ff',
        warn:    '#ff6b35',
        danger:  '#ff3b5c',
        muted:   '#4a5a7a',
        text:    '#c8d8f0',
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Mono"', 'monospace'],
      },
      animation: {
        pulse_slow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
HEREDOC
echo "  ✓ tailwind.config.js"

# ── postcss.config.js ─────────────────────────────────────────────────────
cat > postcss.config.js << 'HEREDOC'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
HEREDOC
echo "  ✓ postcss.config.js"

# ── .env.example ──────────────────────────────────────────────────────────
cat > .env.example << 'HEREDOC'
# CipherMind — Environment Variables
# Copie para .env e preencha com suas chaves reais
# NUNCA commite o .env no repositório

# Claude API Key (obrigatório para o AI Analyst)
# Obtenha em: https://console.anthropic.com
VITE_CLAUDE_API_KEY=your_claude_api_key_here

# NVD API Key (opcional — aumenta o rate limit)
# Obtenha em: https://nvd.nist.gov/developers/request-an-api-key
VITE_NVD_API_KEY=optional_nvd_api_key_here
HEREDOC
echo "  ✓ .env.example"

# ── .gitignore ────────────────────────────────────────────────────────────
cat > .gitignore << 'HEREDOC'
node_modules/
dist/
.env
.DS_Store
*.local
HEREDOC
echo "  ✓ .gitignore"

# ── src/main.jsx ──────────────────────────────────────────────────────────
cat > src/main.jsx << 'HEREDOC'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
HEREDOC
echo "  ✓ src/main.jsx"

# ── src/index.css ─────────────────────────────────────────────────────────
cat > src/index.css << 'HEREDOC'
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: #0a0e1a;
  color: #c8d8f0;
  font-family: 'JetBrains Mono', monospace;
  overflow-x: hidden;
}

::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #0a0e1a; }
::-webkit-scrollbar-thumb { background: #1e2d4a; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #00ff88; }

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 136, 0.015) 2px,
    rgba(0, 255, 136, 0.015) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

.glow-text      { text-shadow: 0 0 8px #00ff88, 0 0 20px #00ff8866; }
.glow-text-blue { text-shadow: 0 0 8px #00c4ff, 0 0 20px #00c4ff66; }

.card-glow:hover {
  box-shadow: 0 0 0 1px #00ff8833, 0 4px 24px #00ff8811;
  transition: box-shadow 0.2s ease;
}

.severity-critical { color: #ff3b5c; border-color: #ff3b5c44; background: #ff3b5c11; }
.severity-high     { color: #ff6b35; border-color: #ff6b3544; background: #ff6b3511; }
.severity-medium   { color: #f9a825; border-color: #f9a82544; background: #f9a82511; }
.severity-low      { color: #00ff88; border-color: #00ff8844; background: #00ff8811; }
.severity-none     { color: #4a5a7a; border-color: #4a5a7a44; background: #4a5a7a11; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeInUp 0.3s ease forwards; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.cursor-blink::after {
  content: '▋';
  color: #00ff88;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes dotPulse {
  0%, 80%, 100% { opacity: 0; }
  40%           { opacity: 1; }
}
.dot-1 { animation: dotPulse 1.4s ease-in-out infinite; }
.dot-2 { animation: dotPulse 1.4s ease-in-out 0.2s infinite; }
.dot-3 { animation: dotPulse 1.4s ease-in-out 0.4s infinite; }
HEREDOC
echo "  ✓ src/index.css"

# ── src/hooks/useCVEData.js ───────────────────────────────────────────────
cat > src/hooks/useCVEData.js << 'HEREDOC'
import { useState, useEffect, useCallback } from 'react'
import { fetchRecentCVEs } from '../services/nvd'
import { fetchCISAKev } from '../services/cisa'

export function useCVEData() {
  const [cves,        setCves]        = useState([])
  const [kevData,     setKevData]     = useState({ total: 0, entries: [] })
  const [loading,     setLoading]     = useState({ cves: false, kev: false })
  const [error,       setError]       = useState({ cves: null, kev: null })
  const [lastUpdated, setLastUpdated] = useState(null)

  const kevIds = new Set(kevData.entries.map(e => e.id))

  const loadCVEs = useCallback(async (options = {}) => {
    setLoading(prev => ({ ...prev, cves: true }))
    setError(prev =>   ({ ...prev, cves: null }))
    try {
      const data = await fetchRecentCVEs(options)
      setCves(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(prev => ({ ...prev, cves: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, cves: false }))
    }
  }, [])

  const loadKEV = useCallback(async () => {
    setLoading(prev => ({ ...prev, kev: true }))
    setError(prev =>   ({ ...prev, kev: null }))
    try {
      const data = await fetchCISAKev()
      setKevData(data)
    } catch (err) {
      setError(prev => ({ ...prev, kev: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, kev: false }))
    }
  }, [])

  useEffect(() => {
    loadCVEs()
    loadKEV()
  }, [loadCVEs, loadKEV])

  return { cves, kevData, kevIds, loading, error, lastUpdated, refresh: { cves: loadCVEs, kev: loadKEV } }
}
HEREDOC
echo "  ✓ src/hooks/useCVEData.js"

# ── src/components/ui/index.jsx ───────────────────────────────────────────
cat > src/components/ui/index.jsx << 'HEREDOC'
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
HEREDOC
echo "  ✓ src/components/ui/index.jsx"

# ── src/components/Layout/index.jsx ──────────────────────────────────────
cat > src/components/Layout/index.jsx << 'HEREDOC'
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
HEREDOC
echo "  ✓ src/components/Layout/index.jsx"

# ── src/components/tabs/CVEFeed.jsx ──────────────────────────────────────
cat > src/components/tabs/CVEFeed.jsx << 'HEREDOC'
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
HEREDOC
echo "  ✓ src/components/tabs/CVEFeed.jsx"

# ── src/components/tabs/CISAKev.jsx ──────────────────────────────────────
cat > src/components/tabs/CISAKev.jsx << 'HEREDOC'
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
HEREDOC
echo "  ✓ src/components/tabs/CISAKev.jsx"

# ── src/components/tabs/AIAnalyst.jsx ────────────────────────────────────
cat > src/components/tabs/AIAnalyst.jsx << 'HEREDOC'
import { useState, useRef, useEffect } from 'react'
import { Send, Brain, Trash2 } from 'lucide-react'
import { queryAnalyst } from '../../services/claude'
import { LoadingDots } from '../ui'

const WELCOME = {
  role: 'assistant',
  content: `CipherMind AI Analyst online.

I'm your senior SOC/Red Team analyst. I can help you:
- Analyze specific CVEs and assess real-world exploitability
- Prioritize vulnerabilities beyond CVSS scores
- Identify ransomware and supply chain risk signals
- Recommend remediation strategies ranked by impact vs effort

Paste a CVE ID, describe a threat scenario, or ask anything security-related.`
}

export function AIAnalystTab({ cves, kevIds }) {
  const [messages,  setMessages]  = useState([WELCOME])
  const [input,     setInput]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)
  const bottomRef                 = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const buildContext = () => {
    if (!cves.length) return ''
    const kevList = cves.filter(c => kevIds.has(c.id)).map(c => c.id)
    return `Loaded CVEs: ${cves.length}. KEV matches: ${kevList.slice(0, 10).join(', ')}. Critical: ${cves.filter(c => c.severity === 'CRITICAL').slice(0, 3).map(c => c.id).join(', ') || 'none'}`
  }

  const handleSend = async () => {
    const text = input.trim().replace(/[<>]/g, '').slice(0, 2000)
    if (!text || isLoading) return
    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setError(null)
    setIsLoading(true)
    try {
      const response = await queryAnalyst(updated.filter(m => m.role !== 'system'), buildContext())
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-accent2" />
          <span className="text-xs font-mono text-text">Claude · SOC/Red Team Analyst</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse" />
        </div>
        <button onClick={() => { setMessages([WELCOME]); setError(null) }}
          className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-danger transition-colors">
          <Trash2 size={12} /> Clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} fade-in`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-accent/20 border border-accent/30' : 'bg-accent2/20 border border-accent2/30'}`}>
              {msg.role === 'user' ? <span className="text-xs font-mono text-accent">›</span> : <Brain size={10} className="text-accent2" />}
            </div>
            <div className={`max-w-[80%] rounded p-3 text-xs font-mono leading-relaxed ${msg.role === 'user' ? 'bg-accent/5 border border-accent/20 text-text' : 'bg-card border border-border text-text/90'}`}>
              {msg.content.split('\n').map((line, j) => <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent2/20 border border-accent2/30 flex items-center justify-center shrink-0"><Brain size={10} className="text-accent2" /></div>
            <div className="bg-card border border-border rounded p-3"><LoadingDots label="Analyzing" /></div>
          </div>
        )}
        {error && <div className="border border-danger/30 bg-danger/5 rounded p-3 text-xs font-mono text-danger">⚠ {error}</div>}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex gap-3">
          <textarea value={input} onChange={e => setInput(e.target.value.slice(0, 2000))}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ask about a CVE, threat scenario, or remediation... (Enter to send)" rows={3}
            className="flex-1 bg-card border border-border rounded px-3 py-2 text-xs font-mono text-text placeholder-muted resize-none focus:outline-none focus:border-accent/50 transition-colors" />
          <button onClick={handleSend} disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-accent/10 border border-accent/30 rounded text-accent text-xs font-mono hover:bg-accent/20 transition-colors disabled:opacity-40 flex items-center gap-2 self-end">
            <Send size={12} /> Send
          </button>
        </div>
        <div className="mt-1.5 text-muted text-xs font-mono">{input.length}/2000 · Shift+Enter for newline</div>
      </div>
    </div>
  )
}
HEREDOC
echo "  ✓ src/components/tabs/AIAnalyst.jsx"

# ── src/components/tabs/ThreatIntel.jsx ──────────────────────────────────
cat > src/components/tabs/ThreatIntel.jsx << 'HEREDOC'
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
HEREDOC
echo "  ✓ src/components/tabs/ThreatIntel.jsx"

# ── src/App.jsx (sobrescreve o existente com versão limpa) ────────────────
cat > src/App.jsx << 'HEREDOC'
import { useState } from 'react'
import { Sidebar, Header }                    from './components/Layout'
import { CVEFeedTab }                         from './components/tabs/CVEFeed'
import { CISAKevTab }                         from './components/tabs/CISAKev'
import { AIAnalystTab }                       from './components/tabs/AIAnalyst'
import { ThreatIntelTab, ReportsTab }         from './components/tabs/ThreatIntel'
import { useCVEData }                         from './hooks/useCVEData'

export default function App() {
  const [activeTab, setActiveTab] = useState('cve')
  const { cves, kevData, kevIds, loading, error, lastUpdated, refresh } = useCVEData()

  const renderTab = () => {
    switch (activeTab) {
      case 'cve':     return <CVEFeedTab    cves={cves} kevIds={kevIds} loading={loading.cves} error={error.cves} onRefresh={refresh.cves} lastUpdated={lastUpdated} />
      case 'kev':     return <CISAKevTab    kevData={kevData} loading={loading.kev} error={error.kev} onRefresh={refresh.kev} />
      case 'analyst': return <AIAnalystTab  cves={cves} kevIds={kevIds} />
      case 'intel':   return <ThreatIntelTab kevIds={kevIds} />
      case 'reports': return <ReportsTab    cves={cves} kevData={kevData} kevIds={kevIds} />
      default:        return null
    }
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} lastUpdated={lastUpdated} kevTotal={kevData.total} />
        <main className="flex-1 overflow-hidden">{renderTab()}</main>
      </div>
    </div>
  )
}
HEREDOC
echo "  ✓ src/App.jsx"

# ── 4. Resultado final ────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}[4/4] Verifying structure...${NC}"
echo ""
find . -type f | grep -v node_modules | grep -v ".git" | sort | while read f; do
  echo "  ✓ $f"
done

echo ""
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Setup complete! Next steps:${NC}"
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo ""
echo "  1. npm install"
echo "  2. cp .env.example .env"
echo "     → add your VITE_CLAUDE_API_KEY"
echo "  3. npm run dev"
echo ""
echo -e "${YELLOW}  Then push to GitHub:${NC}"
echo "  git add ."
echo '  git commit -m "feat: init CipherMind Phase 1"'
echo "  git push"
echo ""
