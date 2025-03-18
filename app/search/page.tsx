import { SearchResultsEnhanced } from "@/components/search-results-enhanced"
import { SearchFilters } from "@/components/search-filters"

export default function SearchPage({
  searchParams,
}: {
  searchParams: {
    q: string
    platform?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    category?: string
  }
}) {
  const query = searchParams.q || ""

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Search Results: {query}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SearchFilters />
        </div>
        <div className="md:col-span-3">
          <SearchResultsEnhanced query={query} searchParams={searchParams} />
        </div>
      </div>
    </main>
  )
}

