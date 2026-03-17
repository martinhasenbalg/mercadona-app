export default function ErrorBanner({ message }) {
  return (
    <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <strong>Error:</strong> {message}
    </div>
  )
}
