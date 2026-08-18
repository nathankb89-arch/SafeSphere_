import { Link } from 'react-router-dom'

export default function HelpBanner() {
  return (
    <aside className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="text-blue-800">New here? Learn how reporting an emergency works.</p>
      <Link to="/how-it-works" className="whitespace-nowrap font-semibold text-blue-800 underline">
        Show me
      </Link>
    </aside>
  )
}
