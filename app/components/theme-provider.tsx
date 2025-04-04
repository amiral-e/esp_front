"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  attribute?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = "data-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    const savedTheme = localStorage.getItem(storageKey)

    if (savedTheme) {
      setTheme(savedTheme as Theme)
      root.classList.remove("light", "dark")
      root.classList.add(savedTheme === "dark" ? "dark" : "light")
      if (attribute === "class") {
        root.classList.add(savedTheme)
      } else {
        root.setAttribute(attribute, savedTheme)
      }
    } else if (enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme("system")
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
      if (attribute === "class") {
        root.classList.add(systemTheme)
      } else {
        root.setAttribute(attribute, systemTheme)
      }
    }
  }, [attribute, enableSystem, storageKey])

  useEffect(() => {
    const handleChange = () => {
      const root = window.document.documentElement
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      if (theme === "system") {
        root.classList.remove("light", "dark")
        root.classList.add(systemTheme)
        if (attribute === "class") {
          root.classList.add(systemTheme)
        } else {
          root.setAttribute(attribute, systemTheme)
        }
      } else {
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        if (attribute === "class") {
          root.classList.add(theme)
        } else {
          root.setAttribute(attribute, theme)
        }
      }
    }

    handleChange()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, attribute])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  if (disableTransitionOnChange) {
    return (
      <ThemeProviderContext.Provider {...props} value={value}>
        {children}
      </ThemeProviderContext.Provider>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

