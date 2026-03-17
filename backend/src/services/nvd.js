const BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
async function nvdFetch(qs) {
  const h = {}; if (process.env.NVD_API_KEY) h['apiKey'] = process.env.NVD_API_KEY
  const res = await fetch(`${BASE}?${qs}`, { headers: h, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw Object.assign(new Error(`NVD error: ${res.status}`), { statusCode: 502 })
  return res.json()
}
export async function getRecentCVEs(params={}) {
  const data = await nvdFetch(new URLSearchParams({ resultsPerPage: 20, ...params }).toString())
  return { total: data.totalResults, cves: (data.vulnerabilities||[]).map(v => { const c=v.cve; const m=c.metrics?.cvssMetricV31?.[0]||c.metrics?.cvssMetricV2?.[0]; return { id: c.id, description: c.descriptions?.find(d=>d.lang==='en')?.value||'', severity: m?.cvssData?.baseSeverity||'UNKNOWN', score: m?.cvssData?.baseScore||null, published: c.published, modified: c.lastModified } }) }
}
export async function getCVEById(id) {
  const data = await nvdFetch(`cveId=${id}`)
  const c = data.vulnerabilities?.[0]?.cve
  if (!c) throw Object.assign(new Error(`CVE ${id} not found`), { statusCode: 404 })
  const m = c.metrics?.cvssMetricV31?.[0]||c.metrics?.cvssMetricV2?.[0]
  return { id: c.id, description: c.descriptions?.find(d=>d.lang==='en')?.value||'', severity: m?.cvssData?.baseSeverity||'UNKNOWN', score: m?.cvssData?.baseScore||null, published: c.published, modified: c.lastModified }
}
