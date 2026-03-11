import { useState, useEffect, useCallback } from 'react'
import { fetchRecentCVEs } from '../services/nvd'
import { fetchCISAKev } from '../services/cisa'

export function useCVEData() {
  const [cves,        setCves]        = useState([])
  const [kevData,     setKevData]     = useState({ total: 0, entries: [] })
  const [loading,     setLoading]     = useState({ cves: false, kev: false })
  const [error,       setError]       = useState({ cves: null, kev: null })
  const [lastUpdated, setLastUpdated] = useState(null)

  const kevIds = new Set(kevData.entries.map(e => e.id))

  const loadCVEs = useCallback(async (options = {}) => {
    setLoading(prev => ({ ...prev, cves: true }))
    setError(prev =>   ({ ...prev, cves: null }))
    try {
      const data = await fetchRecentCVEs(options)
      setCves(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(prev => ({ ...prev, cves: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, cves: false }))
    }
  }, [])

  const loadKEV = useCallback(async () => {
    setLoading(prev => ({ ...prev, kev: true }))
    setError(prev =>   ({ ...prev, kev: null }))
    try {
      const data = await fetchCISAKev()
      setKevData(data)
    } catch (err) {
      setError(prev => ({ ...prev, kev: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, kev: false }))
    }
  }, [])

  useEffect(() => {
    loadCVEs()
    loadKEV()
  }, [loadCVEs, loadKEV])

  return { cves, kevData, kevIds, loading, error, lastUpdated, refresh: { cves: loadCVEs, kev: loadKEV } }
}
