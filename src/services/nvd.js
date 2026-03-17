import { apiRequest } from '../lib/api'

export async function getRecentCVEs(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.append(k, v)
  })
  const query = search.toString()
  const data = await apiRequest(query ? `/api/cves?${query}` : '/api/cves')
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.cves)) return data.cves
  return []
}

export async function getCVEById(cveId) {
  const data = await apiRequest(`/api/cves?id=${encodeURIComponent(cveId)}`)
  if (Array.isArray(data?.cves)) return data.cves[0] || null
  return data
}

export async function fetchRecentCVEs(params = {}) { return getRecentCVEs(params) }
export async function fetchCVEById(cveId) { return getCVEById(cveId) }
