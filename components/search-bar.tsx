"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { safeLocalStorage, useClientSideEffect } from "@/lib/client-utils"

interface SearchBarProps {
  placeholder?: string
  initialQuery?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = "Search...", initialQuery = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  // Load recent searches from localStorage on component mount
  useClientSideEffect(() => {
    const savedSearches = safeLocalStorage.getItem("recentSearches", [])
    setRecentSearches(savedSearches)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    // If onSearch prop is provided, call it
    if (onSearch) {
      onSearch(query)
    } else {
      // Otherwise, navigate to search page
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }

    // Save to recent searches
    if (!recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches].slice(0, 5)
      setRecentSearches(updatedSearches)
      safeLocalStorage.setItem("recentSearches", updatedSearches)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex w-full">
        <Input
          type="search"
          placeholder={placeholder}
          className="w-full pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full px-3">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}

