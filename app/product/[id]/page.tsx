import { Suspense } from "react"
import { ProductDetailsEnhanced } from "@/components/product-details-enhanced"
import { PriceHistory } from "@/components/price-history"
import { LocalStoreComparison } from "@/components/local-store-comparison"
import { Card } from "@/components/ui/card"
import { Product } from "@/lib/types"
import dbConnect from "@/lib/db"
import ProductModel from "@/models/Product"
import { notFound } from "next/navigation"

async function getProduct(id: string): Promise<Product | null> {
  await dbConnect()
  const product = await ProductModel.findOne({ id }).lean()
  if (!product) return null
  
  // Convert MongoDB document to Product type
  const productData = product as any
  return {
    _id: productData._id.toString(),
    id: productData.id,
    name: productData.name || '',
    brand: productData.brand || '',
    category: productData.category || '',
    description: productData.description || '',
    images: productData.images || [],
    specifications: productData.specifications || {},
    prices: productData.prices || {
      current: 0,
      localStores: [],
      onlineStores: [],
      history: []
    },
    reviews: productData.reviews || {
      rating: 0,
      count: 0
    },
    createdAt: productData.createdAt?.toString() || new Date().toISOString(),
    updatedAt: productData.updatedAt?.toString() || new Date().toISOString()
  }
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = await Promise.resolve(params.id)
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="container py-6 space-y-8">
      <Suspense
        fallback={
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="p-0">
                <div className="flex justify-center items-center bg-muted/30 p-8 h-96">
                  <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <div className="h-8 bg-muted/50 rounded-md w-3/4 animate-pulse"></div>
              <div className="h-6 bg-muted/50 rounded-md w-1/2 animate-pulse"></div>
              <div className="h-10 bg-muted/50 rounded-md w-1/3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded-md w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        }
      >
        <ProductDetailsEnhanced productId={product.id} />
      </Suspense>

      <div className="grid md:grid-cols-2 gap-8">
        <Suspense
          fallback={
            <Card className="p-6">
              <div className="h-[300px] bg-muted/30 rounded-lg animate-pulse"></div>
            </Card>
          }
        >
          <PriceHistory id={product.id} />
        </Suspense>

        <Suspense
          fallback={
            <Card className="p-6">
              <div className="space-y-4">
                <div className="h-8 bg-muted/50 rounded-md w-1/2 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </Card>
          }
        >
          <LocalStoreComparison productId={product.id} productName={product.name} />
        </Suspense>
      </div>
    </div>
  )
}
