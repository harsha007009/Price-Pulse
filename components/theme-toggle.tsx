"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { safeLocalStorage, useClientSideEffect } from "@/lib/client-utils"

export function ThemeToggle() {
  const [theme, setTheme] = useState("light")
  const [isMounted, setIsMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize theme from localStorage or system preference
  useClientSideEffect(() => {
    const savedTheme = safeLocalStorage.getItem("theme", null)

    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    safeLocalStorage.setItem("theme", newTheme)
  }

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}

