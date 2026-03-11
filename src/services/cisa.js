const CISA_KEV_URL = '/api/cisa/sites/default/files/feeds/known_exploited_vulnerabilities.json'

export async function fetchCISAKev() {
  const res = await fetch(CISA_KEV_URL, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error(`CISA KEV API error: ${res.status}`)
  const data = await res.json()
  const entries = (data.vulnerabilities || [])
    .map(v => ({
      id:              v.cveID,
      vendorProject:   v.vendorProject,
      product:         v.product,
      name:            v.vulnerabilityName,
      dateAdded:       v.dateAdded,
      shortDesc:       v.shortDescription,
      requiredAction:  v.requiredAction,
      dueDate:         v.dueDate,
      knownRansomware: v.knownRansomwareCampaignUse === 'Known',
      notes:           v.notes || '',
    }))
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  return { total: data.count || entries.length, updated: data.catalogVersion, entries }
}

export function filterKevEntries(entries, query) {
  if (!query || typeof query !== 'string') return entries
  const clean = query.replace(/[^\w\s\-\.]/g, '').toLowerCase().trim()
  if (!clean) return entries
  return entries.filter(e =>
    e.id.toLowerCase().includes(clean) ||
    e.vendorProject.toLowerCase().includes(clean) ||
    e.product.toLowerCase().includes(clean) ||
    e.name.toLowerCase().includes(clean)
  )
}
