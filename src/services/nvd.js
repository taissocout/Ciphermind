const NVD_BASE = '/api/nvd/rest/json/cves/2.0'

function sanitizeQuery(input) {
  if (typeof input !== 'string') return ''
  return input.replace(/[^\w\s\-\.]/g, '').trim().slice(0, 100)
}

// Formato exato que a NVD aceita: 2024-01-01T00:00:00.000
function daysAgo(days) {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 23)
}

export async function fetchRecentCVEs({ limit = 20, keyword = '', severity = '' } = {}) {
  const params = new URLSearchParams()
  params.set('resultsPerPage', Math.min(limit, 100))
  params.set('startIndex', 0)

  const clean = sanitizeQuery(keyword)
  if (clean) {
    params.set('keywordSearch', clean)
  } else {
    params.set('pubStartDate', daysAgo(90))
    params.set('pubEndDate',   daysAgo(0))
  }

  if (severity) params.set('cvssV3Severity', severity)

  const res = await fetch(`${NVD_BASE}?${params.toString()}`, {
    headers: { 'Accept': 'application/json' }
  })
  if (!res.ok) throw new Error(`NVD API error: ${res.status}`)

  const data = await res.json()

  return (data.vulnerabilities || [])
    .map(({ cve }) => ({
      id:          cve.id,
      description: cve.descriptions?.find(d => d.lang === 'en')?.value || 'No description available.',
      published:   cve.published,
      modified:    cve.lastModified,
      severity:    cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity
                   || cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity
                   || 'NONE',
      score:       cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore
                   || cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore
                   || null,
      references:  cve.references?.slice(0, 3).map(r => r.url) || [],
      cvssVector:  cve.metrics?.cvssMetricV31?.[0]?.cvssData?.vectorString || null,
    }))
    .sort((a, b) => new Date(b.published) - new Date(a.published))
}

export async function fetchCVEById(cveId) {
  const cvePattern = /^CVE-\d{4}-\d{4,}$/
  if (!cvePattern.test(cveId)) throw new Error('Invalid CVE ID format')
  const res = await fetch(`${NVD_BASE}?cveId=${encodeURIComponent(cveId)}`, {
    headers: { 'Accept': 'application/json' }
  })
  if (!res.ok) throw new Error(`NVD API error: ${res.status}`)
  const data = await res.json()
  const cve  = data.vulnerabilities?.[0]?.cve
  if (!cve) throw new Error(`CVE ${cveId} not found`)
  return {
    id:          cve.id,
    description: cve.descriptions?.find(d => d.lang === 'en')?.value || '',
    published:   cve.published,
    modified:    cve.lastModified,
    severity:    cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'NONE',
    score:       cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || null,
    references:  cve.references?.map(r => r.url) || [],
    cvssVector:  cve.metrics?.cvssMetricV31?.[0]?.cvssData?.vectorString || null,
    weaknesses:  cve.weaknesses?.map(w => w.description?.[0]?.value).filter(Boolean) || [],
  }
}
