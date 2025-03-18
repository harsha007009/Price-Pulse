"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [platform, setPlatform] = useState(searchParams.get("platform") || "all")
  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "200000"),
  ])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (platform === "all") {
      params.delete("platform")
    } else {
      params.set("platform", platform)
    }

    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    router.push(`/search?${params.toString()}`)
  }

  const resetFilters = () => {
    setPlatform("all")
    setPriceRange([0, 200000])

    const params = new URLSearchParams(searchParams.toString())
    params.delete("platform")
    params.delete("minPrice")
    params.delete("maxPrice")

    router.push(`/search?${params.toString()}`)
  }

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <CardDescription>Refine your search results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Platform</h3>
            <RadioGroup value={platform} onValueChange={setPlatform}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="platform-all" />
                <Label htmlFor="platform-all">All Platforms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amazon" id="platform-amazon" />
                <Label htmlFor="platform-amazon">Amazon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flipkart" id="platform-flipkart" />
                <Label htmlFor="platform-flipkart">Flipkart</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="platform-local" />
                <Label htmlFor="platform-local">Local Stores</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Price Range</h3>
              <span className="text-sm text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </div>
            <Slider
              defaultValue={priceRange}
              min={0}
              max={200000}
              step={5000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

