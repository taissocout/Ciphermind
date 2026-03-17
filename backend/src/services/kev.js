const KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
let cache = null, cacheTime = 0
const TTL = 6*60*60*1000
export async function getKEVCatalog() {
  if (cache && Date.now()-cacheTime < TTL) return cache
  const res = await fetch(KEV_URL, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw Object.assign(new Error('KEV fetch failed'), { statusCode: 502 })
  const data = await res.json()
  cache = { total: data.count, updated: data.catalogVersion, entries: (data.vulnerabilities||[]).map(v => ({ id: v.cveID, vendorProject: v.vendorProject, product: v.product, name: v.vulnerabilityName, dateAdded: v.dateAdded, shortDesc: v.shortDescription, requiredAction: v.requiredAction, dueDate: v.dueDate, knownRansomware: v.knownRansomwareCampaignUse==='Known' })) }
  cacheTime = Date.now(); return cache
}
export function clearCache() { cache = null; cacheTime = 0 }
