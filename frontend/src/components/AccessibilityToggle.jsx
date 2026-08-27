import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityToggle({ inMenu = false }) {
  const { largeText, setLargeText } = useAccessibility()

  return (
    <button
      type="button"
      onClick={() => setLargeText(!largeText)}
      className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 ${inMenu ? 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700' : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'}`}
      aria-label="Toggle larger text"
      aria-pressed={largeText}
    >
      <span className="sm:hidden">A+</span>
      <span className="hidden sm:inline">{largeText ? 'Normal text' : 'Larger text'}</span>
    </button>
  )
}
