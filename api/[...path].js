export default async function handler(req, res) {
  const segments = Array.isArray(req.query.path)
    ? req.query.path
    : [req.query.path].filter(Boolean)

  const path = segments.join('/')
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  const url = `https://tienda.mercadona.es/api/${path}${qs}`

  console.log('[proxy]', url)

  try {
    const upstream = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://tienda.mercadona.es/',
        'Origin': 'https://tienda.mercadona.es',
      },
    })

    if (!upstream.ok) {
      console.error('[proxy] upstream error', upstream.status, url)
      return res.status(upstream.status).json({ error: `upstream ${upstream.status}`, url })
    }

    const data = await upstream.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json(data)
  } catch (err) {
    console.error('[proxy] error', err.message, url)
    return res.status(500).json({ error: err.message, url })
  }
}
