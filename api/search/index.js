export default async function handler(req, res) {
  const q = req.query.q
  if (!q || !q.trim()) return res.status(400).json({ error: 'missing q' })

  try {
    const url = `https://tienda.mercadona.es/api/search/?q=${encodeURIComponent(q)}&lang=es`
    const upstream = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'es-ES,es;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://tienda.mercadona.es/',
        'Origin': 'https://tienda.mercadona.es',
      },
    })

    if (!upstream.ok) return res.status(upstream.status).json({ error: `upstream ${upstream.status}` })

    const data = await upstream.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=60')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
