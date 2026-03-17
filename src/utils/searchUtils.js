export function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function matchesQuery(product, query) {
  const q = normalize(query.trim())
  if (!q) return true
  const name = normalize(product.display_name || '')
  const packaging = normalize(product.packaging || '')
  return name.includes(q) || packaging.includes(q)
}
