import { useState, useEffect } from 'react'
import { fetchCategories } from '../api/mercadona'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetchCategories(controller.signal)
      .then(setCategories)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  return { categories, isLoading, error }
}
