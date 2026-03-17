import ProductCard from '../product/ProductCard'
import EmptyState from '../ui/EmptyState'
import Spinner from '../ui/Spinner'

export default function SearchResults({ query, results, isLoading }) {
  if (!query.trim()) return null

  if (isLoading) {
    return <div className="flex justify-center pt-16"><Spinner /></div>
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={`Sin resultados para "${query}"`}
        subtitle="Prueba con otro término de búsqueda"
      />
    )
  }

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-4">
        {results.length} resultado{results.length !== 1 ? 's' : ''} para <strong>"{query}"</strong>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
