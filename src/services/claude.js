const ANALYST_SYSTEM_PROMPT = `You are CipherMind AI Analyst — a senior cybersecurity analyst with 15+ years of experience in SOC operations, threat intelligence, and red team defense.

Your role is to analyze vulnerabilities, assess threat context, and provide actionable intelligence to security teams.

Communication style:
- Direct and technical — no fluff, no corporate speak
- Think like an attacker, defend like a pro
- Prioritize by real-world exploitability, not just CVSS score
- Flag active exploitation, ransomware associations, and supply chain risks

Always structure your analysis:
1. THREAT SUMMARY (2-3 sentences max)
2. EXPLOITABILITY ASSESSMENT
3. AFFECTED SYSTEMS
4. REMEDIATION PRIORITY (Critical/High/Medium with reasoning)
5. IMMEDIATE ACTIONS`

export async function queryAnalyst(messages, context = '') {
  if (!Array.isArray(messages) || messages.length === 0) throw new Error('Invalid messages format')
  const sanitizedMessages = messages
    .slice(-10)
    .map(msg => ({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: String(msg.content).slice(0, 2000) }))
  const systemWithContext = context ? `${ANALYST_SYSTEM_PROMPT}\n\n--- CURRENT THREAT DATA ---\n${context.slice(0, 3000)}` : ANALYST_SYSTEM_PROMPT
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system: systemWithContext, messages: sanitizedMessages }),
  })
  if (!res.ok) {
    const status = res.status
    if (status === 401) throw new Error('Invalid API key. Check your .env configuration.')
    if (status === 429) throw new Error('Rate limit reached. Please wait a moment.')
    throw new Error(`AI Analyst unavailable (${status})`)
  }
  const data = await res.json()
  return data.content?.[0]?.text || 'No response from analyst.'
}

export async function analyzeCVE(cve, isInKev = false) {
  const prompt = `Analyze this vulnerability:
CVE ID: ${cve.id}
Severity: ${cve.severity} (Score: ${cve.score || 'N/A'})
CISA KEV: ${isInKev ? 'YES — actively exploited' : 'No'}
Description: ${cve.description}
CVSS Vector: ${cve.cvssVector || 'Not available'}
Weaknesses: ${cve.weaknesses?.join(', ') || 'Not specified'}

Provide your threat analysis.`
  return queryAnalyst([{ role: 'user', content: prompt }])
}
