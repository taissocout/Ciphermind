import { apiRequest } from '../lib/api'

export async function fetchThreatMap() {
  return apiRequest('/api/threat-map')
}
