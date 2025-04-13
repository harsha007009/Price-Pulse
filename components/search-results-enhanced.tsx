"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ExternalLink, Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/product-fetcher"
import { ProductImage } from "@/components/product-image"

interface SearchResultsEnhancedProps {
  searchParams: {
    q?: string
    platform?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    category?: string
  }
}

export function SearchResultsEnhanced({ searchParams }: SearchResultsEnhancedProps) {
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get query from searchParams
  const query = searchParams.q || ""

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query string
        const queryParams = new URLSearchParams()
        
        // Add all search parameters to query
        if (query) {
          queryParams.append("q", query)
        }
        
        // Add other search parameters if they exist
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value && key !== 'q') {
            queryParams.append(key, value)
          }
        })

        console.log("Fetching search results with params:", queryParams.toString());
        const response = await fetch(`/api/products/search?${queryParams.toString()}`, {
          // Add cache: 'no-store' to prevent caching errors
          cache: 'no-store'
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || response.statusText || 'Unknown error';
          throw new Error(`Failed to fetch search results: ${errorMessage}`)
        }

        const data = await response.json()
        
        // Validate that the response is an array
        if (!Array.isArray(data)) {
          console.error("Search API returned non-array data:", data);
          throw new Error("Invalid response format from search API");
        }
        
        setResults(data)
      } catch (err: any) {
        console.error("Error fetching search results:", err)
        setError(err?.message || "Failed to load search results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchParams])

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
        // With normalized structure, we'll use the currentPrice and stores array
        const currentPrice = result.currentPrice || 0;
        const originalPrice = result.originalPrice;
        
        // Find the lowest store price
        let lowestStore = null;
        if (result.stores && result.stores.length > 0) {
          lowestStore = result.stores.reduce<typeof result.stores[0] | null>((lowest, store) => {
            return (!lowest || store.price < lowest.price) ? store : lowest;
          }, null);
        }

        return (
          <div key={result.id || result._id?.toString()} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
            <div className="flex justify-center md:block">
              <ProductImage
                src={(result.images && result.images.length > 0) ? result.images[0] : "/placeholder.svg"}
                alt={result.name}
                width={100}
                height={100}
                className="rounded-md object-contain"
                fallbackSrc={`/placeholder.svg?height=100&width=100&text=${encodeURIComponent(result.name)}`}
              />
            </div>
            <div className="flex-1">
              <Link href={`/product/${result.id || result._id}`} className="hover:underline">
                <h2 className="text-lg font-semibold">{result.name}</h2>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{result.description.substring(0, 120)}...</p>
              
              {result.reviews && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{result.reviews.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({result.reviews.count} reviews)</span>
                </div>
              )}
              
              {result.brand && (
                <Badge variant="outline" className="text-sm mt-2">
                  {result.brand}
                </Badge>
              )}
              
              {result.stores && result.stores.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.stores.slice(0, 2).map((store, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm">
                      <Badge variant="outline">{store.name}</Badge>
                      <span className="font-medium">{formatPrice(store.price)}</span>
                      {lowestStore && store.name === lowestStore.name && (
                        <Badge variant="secondary" className="text-xs">
                          Best Price
                        </Badge>
                      )}
                    </div>
                  ))}
                  
                  {result.stores.length > 2 && (
                    <span className="text-xs text-muted-foreground self-center">
                      +{result.stores.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 justify-center items-center md:items-end">
              <div className="text-center md:text-right">
                <p className="text-lg font-bold">{formatPrice(currentPrice)}</p>
                {originalPrice && originalPrice > currentPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Lowest price</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/product/${result.id || result._id}`}>View Details</Link>
                </Button>
                {lowestStore && lowestStore.type === 'online' && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://www.${lowestStore.name.toLowerCase()}.com/s?k=${encodeURIComponent(result.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Buy Now
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

