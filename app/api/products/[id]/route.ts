import { type NextRequest, NextResponse } from "next/server"
import { getProduct } from "@/lib/product-fetcher"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const product = await getProduct(productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 })
  }
}

