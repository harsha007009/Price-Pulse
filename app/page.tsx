import { Search } from "@/components/search"
import { LinkSearch } from "@/components/link-search"
import { ProductTrends } from "@/components/product-trends"
import { RecentlyTracked } from "@/components/recently-tracked"
import { PriceAlerts } from "@/components/price-alerts"
import { NearbyDeals } from "@/components/nearby-deals"
import { ClientWrapper } from "@/components/client-wrapper"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track prices, set alerts, and find the best deals</p>
      </div>

      <ClientWrapper fallback={<div className="h-24 bg-muted/40 rounded-lg animate-pulse"></div>}>
        <Search />
      </ClientWrapper>

      {/* Add the LinkSearch component below the regular search */}
      <div className="mt-4">
        <ClientWrapper fallback={<div className="h-24 bg-muted/40 rounded-lg animate-pulse"></div>}>
          <LinkSearch />
        </ClientWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ProductTrends />
        <ClientWrapper fallback={<div className="h-80 bg-muted/40 rounded-lg animate-pulse"></div>}>
          <RecentlyTracked />
        </ClientWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ClientWrapper fallback={<div className="h-80 bg-muted/40 rounded-lg animate-pulse"></div>}>
          <PriceAlerts />
        </ClientWrapper>
        <NearbyDeals />
      </div>
    </main>
  )
}

