import { createContext, useContext, useEffect, useState } from 'react'

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(() => localStorage.getItem('large_text') === 'true')

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '19px' : '16px'
    localStorage.setItem('large_text', largeText)
  }, [largeText])

  return (
    <AccessibilityContext.Provider value={{ largeText, setLargeText }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)
