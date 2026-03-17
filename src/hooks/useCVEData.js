import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchRecentCVEs } from '../services/nvd'
import { fetchCISAKev } from '../services/cisa'

export function useCVEData() {
  const [cves, setCves] = useState([])
  const [kevData, setKevData] = useState({ total: 0, updated: '', entries: [] })
  const [loading, setLoading] = useState({ cves: false, kev: false })
  const [error, setError] = useState({ cves: null, kev: null })
  const [lastUpdated, setLastUpdated] = useState(null)

  const safeCves = useMemo(() => {
    if (Array.isArray(cves)) return cves
    if (Array.isArray(cves?.cves)) return cves.cves
    return []
  }, [cves])

  const safeKevData = useMemo(() => {
    if (kevData && Array.isArray(kevData.entries)) return {
      total: typeof kevData.total === 'number' ? kevData.total : kevData.entries.length,
      updated: kevData.updated || '',
      entries: kevData.entries
    }
    if (Array.isArray(kevData)) return { total: kevData.length, updated: '', entries: kevData }
    return { total: 0, updated: '', entries: [] }
  }, [kevData])

  const kevIds = useMemo(
    () => new Set(safeKevData.entries.map(e => e.id).filter(Boolean)),
    [safeKevData]
  )

  const loadCVEs = useCallback(async (options = {}) => {
    setLoading(prev => ({ ...prev, cves: true }))
    setError(prev => ({ ...prev, cves: null }))
    try {
      const data = await fetchRecentCVEs(options)
      setCves(Array.isArray(data) ? data : Array.isArray(data?.cves) ? data.cves : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(prev => ({ ...prev, cves: err.message || 'Failed to load CVEs' }))
      setCves([])
    } finally {
      setLoading(prev => ({ ...prev, cves: false }))
    }
  }, [])

  const loadKEV = useCallback(async () => {
    setLoading(prev => ({ ...prev, kev: true }))
    setError(prev => ({ ...prev, kev: null }))
    try {
      const data = await fetchCISAKev()
      if (data && Array.isArray(data.entries)) setKevData(data)
      else if (Array.isArray(data)) setKevData({ total: data.length, updated: '', entries: data })
      else setKevData({ total: 0, updated: '', entries: [] })
    } catch (err) {
      setError(prev => ({ ...prev, kev: err.message || 'Failed to load KEV' }))
      setKevData({ total: 0, updated: '', entries: [] })
    } finally {
      setLoading(prev => ({ ...prev, kev: false }))
    }
  }, [])

  useEffect(() => {
    loadCVEs()
    loadKEV()
  }, [loadCVEs, loadKEV])

  return {
    cves: safeCves, kevData: safeKevData, kevIds,
    loading, error, lastUpdated,
    refresh: { cves: loadCVEs, kev: loadKEV }
  }
}
