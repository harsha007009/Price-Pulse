"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Search() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <Card className="border-none shadow-none bg-muted/40">
      <CardContent className="p-4 md:p-6">
        <div className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search for products (e.g., iPhone 15, Samsung TV, Nike shoes...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-4 pr-12 py-6 text-lg rounded-lg border-muted-foreground/20"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => setQuery("Smartphone")}>
              Smartphones
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuery("Laptop")}>
              Laptops
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuery("Headphones")}>
              Headphones
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuery("Smart Watch")}>
              Smart Watches
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

