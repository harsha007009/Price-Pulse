"use client"

import { useState, useEffect, type ReactNode } from "react"

interface ClientWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ClientWrapper({ children, fallback = null }: ClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? children : fallback
}

