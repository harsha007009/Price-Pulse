import { Suspense } from "react"
import { MapView } from "@/components/map-view"
import { NearbyStoresList } from "@/components/nearby-stores-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NearbyPageProps {
  searchParams: {
    storeId?: string
  }
}

export default async function NearbyPage({ searchParams }: NearbyPageProps) {
  const storeId = await Promise.resolve(searchParams.storeId)
  const selectedStoreId = storeId ? parseInt(storeId) : undefined

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Nearby Stores</h1>
          <Suspense
            fallback={
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                ))}
              </div>
            }
          >
            <NearbyStoresList selectedStoreId={selectedStoreId} />
          </Suspense>
        </div>
        <div>
          <Suspense
            fallback={
              <div className="h-[600px] bg-muted/30 rounded-lg animate-pulse" />
            }
          >
            <MapView selectedStoreId={selectedStoreId} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

