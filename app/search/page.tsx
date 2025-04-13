import { SearchResultsEnhanced } from "@/components/search-results-enhanced"
import { SearchFilters } from "@/components/search-filters"
import { Suspense } from "react"

// Make this a client component since we'll handle the searchParams in the SearchResultsEnhanced component
export default function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    platform?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    category?: string
  }
}) {
  // Use the ReadonlyURLSearchParams object directly without access properties
  // This avoids the "searchParams should be awaited" error
  
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">
        Search Results: {searchParams.q || ""}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SearchFilters />
        </div>
        <div className="md:col-span-3">
          <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResultsEnhanced searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

