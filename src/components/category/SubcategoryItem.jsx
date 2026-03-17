export default function SubcategoryItem({ subcategory, isSelected, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
          isSelected
            ? 'bg-mercadona-green text-white font-medium'
            : 'text-gray-600 hover:bg-mercadona-green-light hover:text-mercadona-green-dark'
        }`}
      >
        {subcategory.name}
      </button>
    </li>
  )
}
