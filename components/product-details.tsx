"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ExternalLink, Heart, Share2, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriceAlertForm } from "@/components/price-alerts"
import { useSavedProducts } from "@/components/saved-products"
import { ClientOnly } from "@/components/client-only"

interface ProductDetailsProps {
  product: any
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate discount percentage
  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  // Truncate description
  const truncatedDescription = product.description.slice(0, 300)
  const shouldTruncate = product.description.length > 300

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{formatPrice(product.currentPrice)}</span>
                    {product.originalPrice > product.currentPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <Badge className="ml-2">
                          {calculateDiscount(product.originalPrice, product.currentPrice)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Includes all taxes and charges</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.availability === "in_stock" ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-300"
                    >
                      In Stock
                    </Badge>
                  ) : product.availability === "low_stock" ? (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300"
                    >
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-300"
                    >
                      Out of Stock
                    </Badge>
                  )}

                  {product.freeDelivery && <Badge variant="outline">Free Delivery</Badge>}

                  {product.fastDelivery && <Badge variant="outline">Fast Delivery</Badge>}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={product.availability === "out_of_stock"}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <ClientOnly>
                      <SaveProductButton productId={product.id} />
                    </ClientOnly>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {product.retailers.map((retailer: any) => (
                      <Button key={retailer.name} variant="outline" asChild>
                        <a
                          href={retailer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1"
                        >
                          <span>{retailer.name}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Description</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {showFullDescription ? product.description : truncatedDescription}
                      {shouldTruncate && !showFullDescription && "..."}
                    </p>
                    {shouldTruncate && (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? "Show less" : "Read more"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3 space-y-4">
          <PriceAlertForm
            productId={product.id}
            productName={product.name}
            currentPrice={product.currentPrice}
            imageUrl={product.images?.[0]?.url}
          />

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Key Specifications</h3>
              <ul className="space-y-2 text-sm">
                {product.specifications.slice(0, 5).map((spec: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-muted-foreground">{spec.name}</span>
                    <span className="font-medium">{spec.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <Link
                  href={`/products/${product.id}/specifications`}
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  View all specifications
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">What's in the Box</h3>
              <ul className="space-y-2">
                {product.boxContents.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-muted rounded-full p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M10 1a6 6 0 00-6 6v1h12V7a6 6 0 00-6-6zM3 13.5a.5.5 0 01.5-.5h13a.5.5 0 010 1h-13a.5.5 0 01-.5-.5zM5.62 17a.5.5 0 01.5-.5h8.76a.5.5 0 010 1H6.12a.5.5 0 01-.5-.5z" />
                      </svg>
                    </span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="py-4">
          <div className="space-y-6">
            {product.specificationGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex}>
                <h3 className="text-lg font-medium mb-3">{group.name}</h3>
                <div className="bg-muted/40 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {group.specifications.map((spec: any, specIndex: number) => (
                        <tr key={specIndex} className={specIndex % 2 === 0 ? "bg-muted/20" : ""}>
                          <td className="py-2 px-4 border-b text-sm font-medium w-1/3">{spec.name}</td>
                          <td className="py-2 px-4 border-b text-sm">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="py-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Reviews will be available soon</p>
          </div>
        </TabsContent>
        <TabsContent value="compare" className="py-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Comparison feature will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Separate component for the save product button to isolate localStorage usage
function SaveProductButton({ productId }: { productId: string }) {
  const { isProductSaved, toggleSavedProduct, isLoaded } = useSavedProducts()

  if (!isLoaded) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Heart className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => toggleSavedProduct(productId)}
      className={isProductSaved(productId) ? "text-red-500" : ""}
    >
      <Heart className={`h-4 w-4 ${isProductSaved(productId) ? "fill-current" : ""}`} />
      <span className="sr-only">{isProductSaved(productId) ? "Remove from wishlist" : "Add to wishlist"}</span>
    </Button>
  )
}

