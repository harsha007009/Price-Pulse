import { Suspense } from "react"
import { SearchFilters } from "@/components/search-filters"
import { SearchResultsEnhanced } from "@/components/search-results-enhanced"
import { Card } from "@/components/ui/card"

interface SearchPageProps {
  searchParams: {
    q?: string
    platform?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    category?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = {
    q: searchParams.q || "",
    platform: searchParams.platform,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    brand: searchParams.brand,
    category: searchParams.category
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SearchFilters currentFilters={resolvedParams} />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold mb-6">
            {resolvedParams.q ? `Search Results for "${resolvedParams.q}"` : "All Products"}
          </h1>
          <Suspense
            fallback={
              <Card className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </Card>
            }
          >
            <SearchResultsEnhanced query={resolvedParams.q} searchParams={resolvedParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

