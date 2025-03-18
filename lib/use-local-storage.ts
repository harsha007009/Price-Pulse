"use client"

import { useState, useEffect } from "react"
import { safeLocalStorage } from "./safe-storage"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on component mount
  useEffect(() => {
    try {
      const item = safeLocalStorage.getItem(key, initialValue)
      setStoredValue(item)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoaded(true)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to localStorage
      safeLocalStorage.setItem(key, valueToStore)
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue, isLoaded] as const
}

