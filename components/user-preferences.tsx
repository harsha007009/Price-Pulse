"use client"

import { useState } from "react"
import { safeLocalStorage, useClientSideEffect } from "@/lib/client-utils"

interface UserPreferences {
  currency: string
  notifications: boolean
  compareMode: "simple" | "detailed"
}

const defaultPreferences: UserPreferences = {
  currency: "INR",
  notifications: true,
  compareMode: "simple",
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  useClientSideEffect(() => {
    const savedPreferences = safeLocalStorage.getItem("userPreferences", defaultPreferences)
    setPreferences(savedPreferences)
    setIsLoaded(true)
  }, [])

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences }
    setPreferences(updatedPreferences)
    safeLocalStorage.setItem("userPreferences", updatedPreferences)
    return updatedPreferences
  }

  return {
    preferences,
    updatePreferences,
    isLoaded,
  }
}

