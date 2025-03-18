/**
 * Safely access localStorage with fallbacks for server-side rendering
 */

// Check if window is defined (browser environment)
const isClient = typeof window !== "undefined"

// Get item from localStorage with fallback
export function getLocalStorageItem(key: string, fallback: any = null): any {
  if (!isClient) return fallback

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error)
    return fallback
  }
}

// Set item in localStorage with error handling
export function setLocalStorageItem(key: string, value: any): boolean {
  if (!isClient) return false

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error)
    return false
  }
}

// Remove item from localStorage with error handling
export function removeLocalStorageItem(key: string): boolean {
  if (!isClient) return false

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error)
    return false
  }
}

