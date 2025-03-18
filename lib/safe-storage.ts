// Check if code is running on the client side
const isClient = typeof window !== "undefined"

// Safe localStorage wrapper
export const safeLocalStorage = {
  getItem: (key: string, fallback: any = null): any => {
    if (!isClient) return fallback
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error)
      return fallback
    }
  },

  setItem: (key: string, value: any): boolean => {
    if (!isClient) return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (!isClient) return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error)
      return false
    }
  },
}

// Safe sessionStorage wrapper
export const safeSessionStorage = {
  getItem: (key: string, fallback: any = null): any => {
    if (!isClient) return fallback
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch (error) {
      console.error(`Error getting sessionStorage item ${key}:`, error)
      return fallback
    }
  },

  setItem: (key: string, value: any): boolean => {
    if (!isClient) return false
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting sessionStorage item ${key}:`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (!isClient) return false
    try {
      sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing sessionStorage item ${key}:`, error)
      return false
    }
  },
}

