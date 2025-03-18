import { type NextRequest, NextResponse } from "next/server"
import { ProductScraper } from "@/lib/product-scraper"
import { getProduct } from "@/lib/product-fetcher"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, amazonUrl, flipkartUrl } = body

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await getProduct(productId)
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Initialize scraper
    const scraper = new ProductScraper()

    // Update product data
    const updatedData = await scraper.updateProductData(
      productId,
      amazonUrl || existingProduct.prices.amazon?.link,
      flipkartUrl || existingProduct.prices.flipkart?.link,
    )

    // In a real implementation, you would save the updated data to your database
    // For this demo, we'll just return the updated data

    return NextResponse.json({
      success: true,
      message: "Product data updated successfully",
      data: updatedData,
    })
  } catch (error) {
    console.error("Error updating product data:", error)
    return NextResponse.json({ error: "Failed to update product data" }, { status: 500 })
  }
}

