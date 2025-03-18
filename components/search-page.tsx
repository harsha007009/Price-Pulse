"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative flex w-full">
          <Input
            type="search"
            placeholder="Search for products..."
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
    </div>
  )
}

