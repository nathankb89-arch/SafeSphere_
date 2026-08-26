import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityToggle() {
  const { largeText, setLargeText } = useAccessibility()

  return (
    <button
      type="button"
      onClick={() => setLargeText(!largeText)}
      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      aria-label="Toggle larger text"
      aria-pressed={largeText}
    >
      {largeText ? 'Normal text' : 'Larger text'}
    </button>
  )
}
