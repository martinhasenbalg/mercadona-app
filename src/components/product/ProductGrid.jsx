import ProductCard from './ProductCard'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'
import EmptyState from '../ui/EmptyState'

export default function ProductGrid({ data, isLoading, error }) {
  if (error) return <ErrorBanner message={error} />

  if (!data && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!data) {
    return (
      <EmptyState
        icon="👈"
        title="Selecciona una categoría"
        subtitle="Elige una categoría del menú lateral para ver los productos"
      />
    )
  }

  const groups = (data.categories ?? []).filter((g) => g.products?.length > 0)

  if (groups.length === 0) {
    return <EmptyState icon="📦" title="Sin productos" subtitle="Esta categoría no tiene productos disponibles" />
  }

  return (
    <div className="p-4">
      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}
      <h2 className="text-xl font-bold text-gray-800 mb-4">{data.name}</h2>
      {groups.map((group) => {
        const products = group.products.filter((p) => p.published !== false)
        if (products.length === 0) return null
        return (
          <section key={group.id} className="mb-8">
            {group.name !== data.name && (
              <h3 className="text-base font-semibold text-gray-600 mb-3 pb-1 border-b border-gray-100">
                {group.name}
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
