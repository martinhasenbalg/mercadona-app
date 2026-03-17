import { useState, useEffect, useRef } from 'react'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimer = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceTimer.current)

    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimer.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: abortRef.current.signal,
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()

        // La API devuelve { results: [...] } o un array directo
        const products = data.results ?? data ?? []
        setResults(Array.isArray(products) ? products : [])
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 350)

    return () => clearTimeout(debounceTimer.current)
  }, [query])

  return { query, setQuery, results, isLoading }
}
