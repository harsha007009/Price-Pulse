"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ExternalLink, Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/product-fetcher"
import { ProductImage } from "@/components/product-image"

interface SearchResultsEnhancedProps {
  query: string
  searchParams: {
    platform?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    category?: string
  }
}

export function SearchResultsEnhanced({ query, searchParams }: SearchResultsEnhancedProps) {
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query string
        const queryParams = new URLSearchParams({
          q: query,
        })

        if (searchParams.platform) {
          queryParams.append("platform", searchParams.platform)
        }

        if (searchParams.minPrice) {
          queryParams.append("minPrice", searchParams.minPrice)
        }

        if (searchParams.maxPrice) {
          queryParams.append("maxPrice", searchParams.maxPrice)
        }

        if (searchParams.brand) {
          queryParams.append("brand", searchParams.brand)
        }

        if (searchParams.category) {
          queryParams.append("category", searchParams.category)
        }

        const response = await fetch(`/api/products/search?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch search results: ${response.statusText}`)
        }

        const data = await response.json()
        setResults(data)
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("Failed to load search results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, searchParams])

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <div className="h-24 w-24 bg-muted/50 rounded-md animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-muted/50 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded-md w-1/2 animate-pulse"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-24 bg-muted/50 rounded-md animate-pulse"></div>
                  <div className="h-8 w-24 bg-muted/50 rounded-md animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2 w-32">
                <div className="h-6 bg-muted/50 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded-md w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Results</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => {
        // Find the lowest price
        const prices = [
          result.prices.amazon?.price,
          result.prices.flipkart?.price,
          ...(result.prices.localStores?.map((store) => store.price) || []),
        ].filter(Boolean) as number[]

        const lowestPrice = Math.min(...prices)

        // Find which platform has the lowest price
        let lowestPlatform = ""

        if (result.prices.amazon?.price === lowestPrice) {
          lowestPlatform = "Amazon"
        } else if (result.prices.flipkart?.price === lowestPrice) {
          lowestPlatform = "Flipkart"
        } else {
          const lowestStore = result.prices.localStores?.find((store) => store.price === lowestPrice)
          if (lowestStore) {
            lowestPlatform = `${lowestStore.name} (${lowestStore.branch})`
          }
        }

        return (
          <div key={result.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
            <div className="flex justify-center md:block">
              <ProductImage
                src={result.images[0] || "/placeholder.svg"}
                alt={result.name}
                width={100}
                height={100}
                className="rounded-md object-contain"
                fallbackSrc={`/placeholder.svg?height=100&width=100&text=${encodeURIComponent(result.name)}`}
              />
            </div>
            <div className="flex-1">
              <Link href={`/product/${result.id}`} className="hover:underline">
                <h2 className="text-lg font-semibold">{result.name}</h2>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{result.description.substring(0, 120)}...</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{result.reviews.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({result.reviews.count} reviews)</span>
                <Badge variant="outline" className="text-sm">
                  {result.brand}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {result.prices.amazon && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline">Amazon</Badge>
                    <span className="font-medium">{formatPrice(result.prices.amazon.price)}</span>
                    {lowestPlatform === "Amazon" && (
                      <Badge variant="secondary" className="text-xs">
                        Best Price
                      </Badge>
                    )}
                  </div>
                )}
                {result.prices.flipkart && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline">Flipkart</Badge>
                    <span className="font-medium">{formatPrice(result.prices.flipkart.price)}</span>
                    {lowestPlatform === "Flipkart" && (
                      <Badge variant="secondary" className="text-xs">
                        Best Price
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center md:items-end">
              <div className="text-center md:text-right">
                <p className="text-lg font-bold">{formatPrice(lowestPrice)}</p>
                <p className="text-xs text-muted-foreground">Lowest price</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/product/${result.id}`}>View Details</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={result.prices.amazon?.link || result.prices.flipkart?.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Buy Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

