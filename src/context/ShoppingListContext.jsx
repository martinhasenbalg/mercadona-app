import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { storageGet, storageSet } from '../utils/storage'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const KEY = 'mercadona_shopping_list'

const ShoppingListContext = createContext(null)

function toShoppingItem(product) {
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
    quantity: 1,
  }
}

export function ShoppingListProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(() => storageGet(KEY, []))

  // Sync from Supabase when user changes
  useEffect(() => {
    if (!user || !supabase) {
      setItems(storageGet(KEY, []))
      return
    }

    supabase
      .from('shopping_list_items')
      .select('product_data, quantity')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const synced = data.map((row) => ({ ...row.product_data, quantity: row.quantity }))
          setItems(synced)
          storageSet(KEY, synced)
        }
      })
  }, [user])

  const save = (next) => {
    storageSet(KEY, next)
    return next
  }

  const upsertRemote = (item) => {
    if (!user || !supabase) return
    supabase.from('shopping_list_items').upsert(
      { user_id: user.id, product_id: String(item.id), product_data: item, quantity: item.quantity },
      { onConflict: 'user_id,product_id' }
    )
  }

  const addItem = useCallback((product) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev
      const item = toShoppingItem(product)
      const next = save([...prev, item])
      upsertRemote(item)
      return next
    })
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = save(prev.filter((i) => i.id !== id))
      if (user && supabase) {
        supabase.from('shopping_list_items').delete().match({ user_id: user.id, product_id: String(id) })
      }
      return next
    })
  }, [user])

  const updateQuantity = useCallback((id, qty) => {
    setItems((prev) => {
      const next = save(prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)))
      const updated = next.find((i) => i.id === id)
      if (updated) upsertRemote(updated)
      return next
    })
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearList = useCallback(() => {
    setItems(save([]))
    if (user && supabase) {
      supabase.from('shopping_list_items').delete().eq('user_id', user.id)
    }
  }, [user])

  const isInList = useCallback((id) => items.some((i) => i.id === id), [items])

  const getQuantity = useCallback(
    (id) => items.find((i) => i.id === id)?.quantity ?? 0,
    [items]
  )

  return (
    <ShoppingListContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearList, isInList, getQuantity }}
    >
      {children}
    </ShoppingListContext.Provider>
  )
}

export function useShoppingList() {
  return useContext(ShoppingListContext)
}
