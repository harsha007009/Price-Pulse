"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { safeLocalStorage, useClientSideEffect } from "@/lib/client-utils"
import { ClientOnly } from "@/components/client-only"

export function RecentSearches() {
  return (
    <ClientOnly>
      <RecentSearchesContent />
    </ClientOnly>
  )
}

function RecentSearchesContent() {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useClientSideEffect(() => {
    const savedSearches = safeLocalStorage.getItem("recentSearches", [])
    setRecentSearches(savedSearches)
  }, [])

  const clearSearch = (search: string) => {
    const updatedSearches = recentSearches.filter((s) => s !== search)
    setRecentSearches(updatedSearches)
    safeLocalStorage.setItem("recentSearches", updatedSearches)
  }

  const clearAllSearches = () => {
    setRecentSearches([])
    safeLocalStorage.setItem("recentSearches", [])
  }

  if (recentSearches.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent Searches</h3>
        <Button variant="ghost" size="sm" onClick={clearAllSearches}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search) => (
          <div key={search} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <Link href={`/search?q=${encodeURIComponent(search)}`} className="hover:underline">
              {search}
            </Link>
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => clearSearch(search)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {search}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

