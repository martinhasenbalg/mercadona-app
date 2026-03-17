import SubcategoryItem from './SubcategoryItem'

export default function CategoryGroup({ category, isOpen, onToggle, selectedSubcategoryId, onSelectSubcategory }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{category.name}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="pb-2 px-2 space-y-0.5">
          {category.categories
            .filter((sub) => sub.published !== false)
            .map((sub) => (
              <SubcategoryItem
                key={sub.id}
                subcategory={sub}
                isSelected={selectedSubcategoryId === sub.id}
                onClick={() => onSelectSubcategory(sub.id)}
              />
            ))}
        </ul>
      )}
    </div>
  )
}
