import Link from "next/link"
import { ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/product-image"

interface SearchResultsProps {
  query: string
  searchParams: {
    platform?: string
    minPrice?: string
    maxPrice?: string
  }
}

export async function SearchResults({ query, searchParams }: SearchResultsProps) {
  // In a real app, this would be an API call to fetch search results
  // based on the query and filters
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  const results = [
    {
      id: "iphone-15-pro-256gb",
      name: "Apple iPhone 15 Pro (256GB)",
      image: "https://m.media-amazon.com/images/I/81fxjeu8fdL._SL1500_.jpg",
      description: "6.1-inch Super Retina XDR display, A17 Pro chip, Pro camera system",
      amazonPrice: 131900,
      flipkartPrice: 129900,
      localStorePrice: 134000,
      rating: 4.8,
      reviews: 1243,
      inStock: true,
    },
    {
      id: "samsung-galaxy-s23-ultra",
      name: "Samsung Galaxy S23 Ultra",
      image: "https://m.media-amazon.com/images/I/61VfL-aiToL._SL1500_.jpg",
      description: "6.8-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 200MP camera",
      amazonPrice: 124999,
      flipkartPrice: 119999,
      localStorePrice: 124990,
      rating: 4.7,
      reviews: 987,
      inStock: true,
    },
    {
      id: "google-pixel-8-pro",
      name: "Google Pixel 8 Pro",
      image: "https://m.media-amazon.com/images/I/71OJJCFnUJL._SL1500_.jpg",
      description: "6.7-inch LTPO OLED, Google Tensor G3, 50MP triple camera",
      amazonPrice: 99999,
      flipkartPrice: 97999,
      localStorePrice: null,
      rating: 4.6,
      reviews: 756,
      inStock: true,
    },
    {
      id: "oneplus-12",
      name: "OnePlus 12",
      image: "https://m.media-amazon.com/images/I/71K84j2O8lL._SL1500_.jpg",
      description: "6.82-inch LTPO AMOLED, Snapdragon 8 Gen 3, 50MP triple camera",
      amazonPrice: 64999,
      flipkartPrice: 62999,
      localStorePrice: 64990,
      rating: 4.5,
      reviews: 542,
      inStock: false,
    },
  ]

  // Filter results based on searchParams
  const filteredResults = results.filter((result) => {
    if (searchParams.platform) {
      if (searchParams.platform === "amazon" && !result.amazonPrice) return false
      if (searchParams.platform === "flipkart" && !result.flipkartPrice) return false
      if (searchParams.platform === "local" && !result.localStorePrice) return false
    }

    const minPrice = searchParams.minPrice ? Number.parseInt(searchParams.minPrice) : 0
    const maxPrice = searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice) : Number.POSITIVE_INFINITY

    const lowestPrice = Math.min(
      result.amazonPrice || Number.POSITIVE_INFINITY,
      result.flipkartPrice || Number.POSITIVE_INFINITY,
      result.localStorePrice || Number.POSITIVE_INFINITY,
    )

    return lowestPrice >= minPrice && lowestPrice <= maxPrice
  })

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredResults.map((result) => {
        const lowestPrice = Math.min(
          result.amazonPrice || Number.POSITIVE_INFINITY,
          result.flipkartPrice || Number.POSITIVE_INFINITY,
          result.localStorePrice || Number.POSITIVE_INFINITY,
        )

        const lowestPlatform =
          lowestPrice === result.amazonPrice
            ? "Amazon"
            : lowestPrice === result.flipkartPrice
              ? "Flipkart"
              : "Local Store"

        return (
          <div key={result.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
            <div className="flex justify-center md:block">
              <ProductImage
                src={result.image}
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
              <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{result.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({result.reviews} reviews)</span>
                {!result.inStock && (
                  <Badge variant="outline" className="text-red-500 border-red-200">
                    Out of stock
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {result.amazonPrice && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline">Amazon</Badge>
                    <span className="font-medium">{formatPrice(result.amazonPrice)}</span>
                    {lowestPlatform === "Amazon" && (
                      <Badge variant="secondary" className="text-xs">
                        Best Price
                      </Badge>
                    )}
                  </div>
                )}
                {result.flipkartPrice && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline">Flipkart</Badge>
                    <span className="font-medium">{formatPrice(result.flipkartPrice)}</span>
                    {lowestPlatform === "Flipkart" && (
                      <Badge variant="secondary" className="text-xs">
                        Best Price
                      </Badge>
                    )}
                  </div>
                )}
                {result.localStorePrice && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline">Local Store</Badge>
                    <span className="font-medium">{formatPrice(result.localStorePrice)}</span>
                    {lowestPlatform === "Local Store" && (
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
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

