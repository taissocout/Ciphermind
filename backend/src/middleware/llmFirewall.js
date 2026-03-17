const BLOCK = [/ignore\s+previous\s+instructions/i,/reveal\s+your\s+system\s+prompt/i,/list\s+all\s+environment\s+variables/i,/CLAUDE_API_KEY/i,/jailbreak/i,/\bDAN\b/i]
export function llmFirewall(req, res, next) {
  const text = (Array.isArray(req.body?.messages) ? req.body.messages : []).map(m => String(m?.content||'')).join('\n')
  if (BLOCK.some(p => p.test(text))) return res.status(400).json({ error: 'Prompt injection detected.' })
  req.llmFirewall = { blocked: false }; return next()
}
