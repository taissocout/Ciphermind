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
