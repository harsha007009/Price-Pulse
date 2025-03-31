import { type NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@/lib/product-fetcher"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const brand = searchParams.get("brand") || undefined
    const category = searchParams.get("category") || undefined
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined

    console.log(`Search request: query=${query}, brand=${brand}, category=${category}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    const products = await searchProducts(query, {
      brand,
      category,
      minPrice,
      maxPrice,
    });
    
    console.log(`Found ${products.length} products matching query: "${query}"`);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
