export default function EmptyState({ icon = '📦', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-lg font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  )
}
