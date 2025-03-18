import { Suspense } from "react"
import { MapView } from "@/components/map-view"
import { NearbyStoresList } from "@/components/nearby-stores-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NearbyPage({ searchParams }: { searchParams: { storeId?: string } }) {
  const selectedStoreId = searchParams.storeId ? Number.parseInt(searchParams.storeId) : undefined

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Nearby Stores</h1>

      <Tabs defaultValue="list" className="mt-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <Suspense fallback={<div className="h-96 w-full bg-muted rounded-lg animate-pulse" />}>
            <NearbyStoresList selectedStoreId={selectedStoreId} />
          </Suspense>
        </TabsContent>
        <TabsContent value="map" className="mt-4">
          <Suspense fallback={<div className="h-96 w-full bg-muted rounded-lg animate-pulse" />}>
            <MapView selectedStoreId={selectedStoreId} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  )
}

