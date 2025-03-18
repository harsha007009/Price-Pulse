"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Loader2, MapPin } from "lucide-react"

// Define the Google Maps API key
// In a real app, this would be an environment variable
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY" // Replace with your actual API key

// Define the store location interface
export interface StoreLocation {
  id: string | number
  name: string
  branch?: string
  address: string
  lat: number
  lng: number
  distance?: string
}

interface GoogleMapProps {
  stores: StoreLocation[]
  onStoreSelect?: (store: StoreLocation) => void
  selectedStoreId?: string | number | null
  height?: string
  zoom?: number
  center?: { lat: number; lng: number } | null
}

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

export function GoogleMap({
  stores,
  onStoreSelect,
  selectedStoreId = null,
  height = "500px",
  zoom = 13,
  center = null,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Initialize the map when the Google Maps script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    // Default center (Visakhapatnam, India)
    const defaultCenter = { lat: 17.6868, lng: 83.2185 }

    // Create the map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: center || userLocation || defaultCenter,
      zoom: zoom,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_TOP,
      },
    })

    setMap(mapInstance)

    // Try to get user's location
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setUserLocation(userPos)

            // Center map on user location if no center is provided
            if (!center) {
              mapInstance.setCenter(userPos)
            }

            // Add user marker
            const marker = new window.google.maps.Marker({
              position: userPos,
              map: mapInstance,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              },
              title: "Your Location",
            })

            setUserMarker(marker)
          },
          (error) => {
            console.warn("Geolocation error:", error.message)
            // Use default location (Visakhapatnam, India) when geolocation fails
            const defaultPos = { lat: 17.6868, lng: 83.2185 }

            // Center map on default location if no center is provided
            if (!center) {
              mapInstance.setCenter(defaultPos)
            }
          },
          { timeout: 10000, enableHighAccuracy: false },
        )
      } catch (error) {
        console.warn("Geolocation API error:", error)
        // Use default location when geolocation API fails completely
        if (!center) {
          mapInstance.setCenter({ lat: 17.6868, lng: 83.2185 })
        }
      }
    } else {
      console.warn("Geolocation is not supported by this browser")
      // Use default location when geolocation is not supported
      if (!center) {
        mapInstance.setCenter({ lat: 17.6868, lng: 83.2185 })
      }
    }
  }, [mapLoaded, center, zoom, userLocation])

  // Add markers for stores when the map and stores are available
  useEffect(() => {
    if (!map || !stores.length) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))

    // Create new markers
    const newMarkers = stores.map((store) => {
      const marker = new window.google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map: map,
        title: store.name,
        animation: store.id === selectedStoreId ? window.google.maps.Animation.BOUNCE : undefined,
      })

      // Add click event listener
      marker.addListener("click", () => {
        if (onStoreSelect) {
          onStoreSelect(store)
        }
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${store.name}</h3>
            <p style="margin: 0;">${store.branch || ""}</p>
            <p style="margin: 4px 0 0; font-size: 0.9em;">${store.address}</p>
            ${store.distance ? `<p style="margin: 4px 0 0; font-size: 0.9em;">Distance: ${store.distance}</p>` : ""}
          </div>
        `,
      })

      marker.addListener("mouseover", () => {
        infoWindow.open(map, marker)
      })

      marker.addListener("mouseout", () => {
        infoWindow.close()
      })

      return marker
    })

    setMarkers(newMarkers)

    // Fit bounds to include all markers if there are multiple stores
    if (newMarkers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()

      // Include store markers
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition()!)
      })

      // Include user location if available
      if (userMarker) {
        bounds.extend(userMarker.getPosition()!)
      }

      map.fitBounds(bounds)

      // Add some padding
      const padding = { top: 50, right: 50, bottom: 50, left: 50 }
      map.fitBounds(bounds, padding)
    }

    // If a store is selected, center on it
    if (selectedStoreId) {
      const selectedStore = stores.find((store) => store.id === selectedStoreId)
      if (selectedStore) {
        map.setCenter({ lat: selectedStore.lat, lng: selectedStore.lng })
        map.setZoom(16)
      }
    }

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null))
    }
  }, [map, stores, selectedStoreId, onStoreSelect, userMarker])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setMapLoaded(true)}
        onError={() => console.warn("Google Maps script failed to load")}
      />
      <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
        {mapLoaded && stores.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <div className="flex flex-col items-center p-4 text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No store locations available</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

