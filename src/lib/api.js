const API_URL = import.meta.env.VITE_API_URL

export async function apiRequest(path, options = {}) {
  const url = `${API_URL}${path}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal
    })
    const contentType = response.headers.get('content-type') || ''
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      const message = typeof payload === 'object' && payload?.error
        ? payload.error
        : `HTTP ${response.status} on ${path}`
      throw new Error(message)
    }
    return payload
  } catch (error) {
    if (error.name === 'AbortError') throw new Error(`Timeout calling ${path}`)
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
