import ProductCard from '../product/ProductCard'
import EmptyState from '../ui/EmptyState'

export default function SearchResults({ query, results }) {
  if (!query.trim()) return null

  if (results.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={`Sin resultados para "${query}"`}
        subtitle="Prueba con otro término o explora más categorías primero"
      />
    )
  }

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-4">
        {results.length} resultado{results.length !== 1 ? 's' : ''} para <strong>"{query}"</strong>
        <span className="ml-2 text-xs text-gray-400">(de categorías ya cargadas)</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
