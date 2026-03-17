import { apiRequest } from '../lib/api'

export async function getKEVCatalog() {
  const data = await apiRequest('/api/kev')
  if (data && Array.isArray(data.entries)) return data
  return { total: 0, updated: '', entries: [] }
}

export async function fetchCISAKev() {
  return getKEVCatalog()
}

export function filterKevEntries(entries = [], search = '') {
  const term = String(search || '').trim().toLowerCase()
  if (!term) return entries
  return entries.filter(entry =>
    [entry.id, entry.vendorProject, entry.product, entry.name, entry.shortDesc]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(term))
  )
}
