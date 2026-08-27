import { useEffect, useState } from 'react'

export default function ThemeToggle({ compact = false, inMenu = false }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('safeSphereTheme') || 'light')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
    localStorage.setItem('safeSphereTheme', theme)
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 ${inMenu ? 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700' : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'}`}
      aria-label="Toggle light and dark theme"
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {compact ? (
        <span aria-hidden="true" className="text-lg leading-none">{theme === 'dark' ? '☀' : '☾'}</span>
      ) : (
        <>
          <span className="sm:hidden">{theme === 'dark' ? 'L' : 'D'}</span>
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </>
      )}
    </button>
  )
}
