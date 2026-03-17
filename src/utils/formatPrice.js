export function formatEur(value) {
  const n = parseFloat(value)
  if (isNaN(n)) return ''
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export function formatRefPrice(price_instructions) {
  const { bulk_price, reference_price, reference_format, size_format, approx_size } = price_instructions
  const ref = reference_price || bulk_price
  if (!ref) return null
  const fmt = reference_format || size_format || ''
  const prefix = approx_size ? '~' : ''
  return `${prefix}${formatEur(ref)} / ${fmt}`
}
