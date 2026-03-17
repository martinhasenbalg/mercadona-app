import { useState, useEffect, useRef } from 'react'
import { matchesQuery } from '../utils/searchUtils'

export function useSearch(productCache) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const debounceTimer = useRef(null)

  useEffect(() => {
    clearTimeout(debounceTimer.current)

    if (!query.trim()) {
      setResults([])
      return
    }

    debounceTimer.current = setTimeout(() => {
      const allProducts = []
      for (const { data } of productCache.current.values()) {
        for (const group of data.categories ?? []) {
          for (const product of group.products ?? []) {
            if (product.published) allProducts.push(product)
          }
        }
      }
      setResults(allProducts.filter((p) => matchesQuery(p, query)))
    }, 300)

    return () => clearTimeout(debounceTimer.current)
  }, [query, productCache])

  return { query, setQuery, results }
}
