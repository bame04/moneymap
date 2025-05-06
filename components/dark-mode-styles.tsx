"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

// This component adds additional class-based styling for dark mode
// to elements that might be difficult to style with Tailwind alone
export function DarkModeStyles() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Apply specific styles for charts and other components that need JS-based theme switching
    const applyDarkModeStyles = () => {
      if (resolvedTheme === "dark") {
        document.documentElement.classList.add("dark-charts")
      } else {
        document.documentElement.classList.remove("dark-charts")
      }
    }

    applyDarkModeStyles()

    // Add event listener for theme changes
    window.addEventListener("theme-change", applyDarkModeStyles)

    return () => {
      window.removeEventListener("theme-change", applyDarkModeStyles)
    }
  }, [resolvedTheme])

  return null
}
