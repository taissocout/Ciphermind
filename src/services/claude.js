import { apiRequest } from '../lib/api'

export async function queryAnalyst(query, context = '') {
  const data = await apiRequest('/api/analyst', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{ role: 'user', content: String(query ?? '') }],
      context
    })
  })
  if (typeof data === 'string') return data
  if (typeof data?.response === 'string') return data.response
  return 'No response from analyst.'
}

export async function analyzeThreat(query, context = '') { return queryAnalyst(query, context) }
export async function analyzeCVE(cve, context = '') {
  return queryAnalyst(typeof cve === 'string' ? cve : JSON.stringify(cve), context)
}
export async function fetchAnalyst(query, context = '') { return queryAnalyst(query, context) }
