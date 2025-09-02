import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('userSettings')
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        return parsed.theme || 'dark'
      } catch {
        return 'dark'
      }
    }
    return 'dark'
  })

  const [isDark, setIsDark] = useState(true)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    // Update localStorage
    const savedSettings = localStorage.getItem('userSettings')
    let settings = {}
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings)
      } catch {
        settings = {}
      }
    }
    settings = { ...settings, theme: newTheme }
    localStorage.setItem('userSettings', JSON.stringify(settings))
  }

  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = true

      if (theme === 'light') {
        shouldBeDark = false
      } else if (theme === 'dark') {
        shouldBeDark = true
      } else if (theme === 'auto') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }

      setIsDark(shouldBeDark)
      
      // Apply theme to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    }

    updateTheme()

    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => updateTheme()
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
