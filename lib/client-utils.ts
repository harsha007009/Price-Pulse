"use client"

import { useState, useEffect } from "react"

// Check if code is running on the client side
export const isClient = typeof window !== "undefined"

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

// Safe window operations
export const safeWindow = {
  location: {
    get href() {
      return isClient ? window.location.href : ""
    },
    get pathname() {
      return isClient ? window.location.pathname : ""
    },
    get search() {
      return isClient ? window.location.search : ""
    },
    get hash() {
      return isClient ? window.location.hash : ""
    },
  },

  navigator: {
    get userAgent() {
      return isClient ? window.navigator.userAgent : ""
    },
    get language() {
      return isClient ? window.navigator.language : ""
    },
  },

  matchMedia: (query: string) => {
    if (!isClient) return { matches: false }
    return window.matchMedia(query)
  },
}

// Create a useClientSideEffect hook that only runs on the client
export function useClientSideEffect(effect: () => void | (() => void), deps: any[] = []) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (isMounted) {
      return effect()
    }
  }, [isMounted, ...deps])
}

