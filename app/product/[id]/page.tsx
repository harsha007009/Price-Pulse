import { Suspense } from "react"
import { ProductDetailsEnhanced } from "@/components/product-details-enhanced"
import { PriceHistory } from "@/components/price-history"
import { LocalStoreComparison } from "@/components/local-store-comparison"
import { Skeleton } from "@/components/ui/skeleton"
import { getProduct } from "@/lib/product-fetcher"

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Pre-fetch the product to get the name for the LocalStoreComparison
  const product = await getProduct(params.id)
  const productName = product?.name || "Product"

  return (
    <main className="container mx-auto px-4 py-6">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetailsEnhanced productId={params.id} />
      </Suspense>

      <div className="mt-8 space-y-8">
        <Suspense fallback={<div className="h-80 w-full bg-muted rounded-lg animate-pulse" />}>
          <PriceHistory id={params.id} />
        </Suspense>

        <Suspense fallback={<div className="h-80 w-full bg-muted rounded-lg animate-pulse" />}>
          <LocalStoreComparison productId={params.id} productName={productName} />
        </Suspense>
      </div>
    </main>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="h-96 w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="pt-4 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

