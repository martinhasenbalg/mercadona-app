async function mercadona(path) {
  const res = await fetch(`https://tienda.mercadona.es/api${path}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'es-ES,es;q=0.9',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://tienda.mercadona.es/',
      'Origin': 'https://tienda.mercadona.es',
    },
  })
  if (!res.ok) throw new Error(`upstream ${res.status}`)
  return res.json()
}

export default async function handler(req, res) {
  try {
    const data = await mercadona('/categories/')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300')
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
