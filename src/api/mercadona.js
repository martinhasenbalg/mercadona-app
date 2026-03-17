const BASE = import.meta.env.DEV ? '/api' : '/api/proxy'

export async function fetchCategories(signal) {
  const res = await fetch(`${BASE}/categories/`, { signal })
  if (!res.ok) throw new Error(`Error ${res.status} al cargar categorías`)
  const data = await res.json()
  return data.results ?? data
}

export async function fetchCategoryProducts(id, signal) {
  const res = await fetch(`${BASE}/categories/${id}/`, { signal })
  if (!res.ok) throw new Error(`Error ${res.status} al cargar productos`)
  return res.json()
}
