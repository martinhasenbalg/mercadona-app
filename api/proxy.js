export default async function handler(req, res) {
  // Extraer el path después de /api/proxy/
  const path = req.url.replace(/^\/api\/proxy/, '') || '/'
  const url = `https://tienda.mercadona.es/api${path}`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://tienda.mercadona.es/',
        'Origin': 'https://tienda.mercadona.es',
      },
    })

    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
