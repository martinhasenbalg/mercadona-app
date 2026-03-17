import { useState, useEffect, useRef } from 'react'
import { fetchCategoryProducts } from '../api/mercadona'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function useCategoryProducts(subcategoryId) {
  const cache = useRef(new Map())
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!subcategoryId) {
      setData(null)
      return
    }

    const cached = cache.current.get(subcategoryId)
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setData(cached.data)
      setError(null)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)
    if (cached) setData(cached.data) // show stale while revalidating

    fetchCategoryProducts(subcategoryId, controller.signal)
      .then((result) => {
        cache.current.set(subcategoryId, { data: result, fetchedAt: Date.now() })
        setData(result)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [subcategoryId])

  return { data, isLoading, error }
}

// Export the cache ref factory so AppShell can accumulate products for search
export { CACHE_TTL }
