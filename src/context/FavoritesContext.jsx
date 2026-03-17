import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { storageGet, storageSet } from '../utils/storage'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const KEY = 'mercadona_favorites'

const FavoritesContext = createContext(null)

function toFavoriteItem(product) {
  const pi = product.price_instructions ?? {}
  return {
    id: product.id,
    display_name: product.display_name,
    thumbnail: product.thumbnail,
    unit_price: pi.unit_price,
    bulk_price: pi.bulk_price,
    size_format: pi.size_format,
    reference_price: pi.reference_price,
    reference_format: pi.reference_format,
    packaging: product.packaging,
    slug: product.slug,
    price_instructions: pi,
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(() => storageGet(KEY, []))
  const [syncing, setSyncing] = useState(false)

  // Sync from Supabase when user changes
  useEffect(() => {
    if (!user || !supabase) {
      setFavorites(storageGet(KEY, []))
      return
    }

    setSyncing(true)
    supabase
      .from('favorites')
      .select('product_data')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const items = data.map((row) => row.product_data)
          setFavorites(items)
          storageSet(KEY, items)
        }
        setSyncing(false)
      })
  }, [user])

  const addFavorite = useCallback((product) => {
    const item = toFavoriteItem(product)
    setFavorites((prev) => {
      if (prev.some((f) => f.id === product.id)) return prev
      const next = [...prev, item]
      storageSet(KEY, next)
      return next
    })
    if (user && supabase) {
      supabase.from('favorites').upsert(
        { user_id: user.id, product_id: String(item.id), product_data: item },
        { onConflict: 'user_id,product_id' }
      )
    }
  }, [user])

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id)
      storageSet(KEY, next)
      return next
    })
    if (user && supabase) {
      supabase.from('favorites').delete().match({ user_id: user.id, product_id: String(id) })
    }
  }, [user])

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  )

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, syncing }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
