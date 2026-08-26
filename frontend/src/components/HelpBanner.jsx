import { Link } from 'react-router-dom'

export default function HelpBanner() {
  return (
    <aside className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900/60 dark:bg-red-950/20">
      <p className="text-sm font-medium text-red-900 dark:text-red-100">New here? Learn how reporting an emergency works in under a minute.</p>
      <Link to="/how-it-works" className="whitespace-nowrap rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500">
        Show me
      </Link>
    </aside>
  )
}
