import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityToggle() {
  const { largeText, setLargeText } = useAccessibility()

  return (
    <button
      type="button"
      onClick={() => setLargeText(!largeText)}
      className="text-sm underline"
      aria-label="Toggle larger text"
      aria-pressed={largeText}
    >
      {largeText ? 'Normal Text' : 'Larger Text'}
    </button>
  )
}
