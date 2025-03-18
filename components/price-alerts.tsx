"use client"

import type React from "react"

import { useState } from "react"
import { Bell, BellOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { safeLocalStorage, useClientSideEffect } from "@/lib/client-utils"
import { ClientOnly } from "@/components/client-only"

interface PriceAlert {
  productId: string
  productName: string
  currentPrice: number
  targetPrice: number
  createdAt: string
  imageUrl?: string
}

// Custom hook for managing price alerts
export function usePriceAlerts() {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useClientSideEffect(() => {
    const alerts = safeLocalStorage.getItem("priceAlerts", [])
    setPriceAlerts(alerts)
    setIsLoaded(true)
  }, [])

  const addPriceAlert = (
    productId: string,
    productName: string,
    currentPrice: number,
    targetPrice: number,
    imageUrl?: string,
  ) => {
    const newAlert: PriceAlert = {
      productId,
      productName,
      currentPrice,
      targetPrice,
      createdAt: new Date().toISOString(),
      imageUrl,
    }

    const updatedAlerts = [...priceAlerts.filter((alert) => alert.productId !== productId), newAlert]
    setPriceAlerts(updatedAlerts)
    safeLocalStorage.setItem("priceAlerts", updatedAlerts)
    return updatedAlerts
  }

  const removePriceAlert = (productId: string) => {
    const updatedAlerts = priceAlerts.filter((alert) => alert.productId !== productId)
    setPriceAlerts(updatedAlerts)
    safeLocalStorage.setItem("priceAlerts", updatedAlerts)
    return updatedAlerts
  }

  const getProductAlert = (productId: string) => {
    return priceAlerts.find((alert) => alert.productId === productId)
  }

  return {
    priceAlerts,
    addPriceAlert,
    removePriceAlert,
    getProductAlert,
    isLoaded,
  }
}

// Price alert form component for a single product
interface PriceAlertFormProps {
  productId: string
  productName: string
  currentPrice: number
  imageUrl?: string
}

export function PriceAlertForm({ productId, productName, currentPrice, imageUrl }: PriceAlertFormProps) {
  return (
    <ClientOnly
      fallback={
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Price Alert
            </CardTitle>
            <CardDescription>Get notified when the price drops below your target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-4 text-center text-muted-foreground">Loading price alert options...</div>
          </CardContent>
        </Card>
      }
    >
      <PriceAlertFormContent
        productId={productId}
        productName={productName}
        currentPrice={currentPrice}
        imageUrl={imageUrl}
      />
    </ClientOnly>
  )
}

function PriceAlertFormContent({ productId, productName, currentPrice, imageUrl }: PriceAlertFormProps) {
  const { getProductAlert, addPriceAlert, removePriceAlert } = usePriceAlerts()
  const [targetPrice, setTargetPrice] = useState<number>(Math.floor(currentPrice * 0.9)) // Default to 10% off
  const existingAlert = getProductAlert(productId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (targetPrice > 0 && targetPrice < currentPrice) {
      addPriceAlert(productId, productName, currentPrice, targetPrice, imageUrl)
    }
  }

  const handleRemove = () => {
    removePriceAlert(productId)
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
          <Bell className="h-5 w-5" />
          Price Alert
        </CardTitle>
        <CardDescription>Get notified when the price drops below your target</CardDescription>
      </CardHeader>
      <CardContent>
        {existingAlert ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="font-medium">{formatPrice(currentPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Price</p>
                <p className="font-medium text-green-600">{formatPrice(existingAlert.targetPrice)}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">We'll notify you when the price drops below your target.</p>
            <Button variant="outline" className="w-full" onClick={handleRemove}>
              <BellOff className="h-4 w-4 mr-2" />
              Remove Alert
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="font-medium">{formatPrice(currentPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Price</p>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-24"
                    min={1}
                    max={currentPrice - 1}
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Set Price Alert
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

// Main PriceAlerts component for displaying all alerts
export function PriceAlerts() {
  return (
    <ClientOnly
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Price Alerts</CardTitle>
            <CardDescription>Get notified when prices drop</CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Loading your price alerts...</p>
          </CardContent>
        </Card>
      }
    >
      <PriceAlertsContent />
    </ClientOnly>
  )
}

function PriceAlertsContent() {
  const { priceAlerts, removePriceAlert, isLoaded } = usePriceAlerts()

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate savings
  const calculateSavings = (currentPrice: number, targetPrice: number) => {
    return currentPrice - targetPrice
  }

  // Calculate savings percentage
  const calculateSavingsPercentage = (currentPrice: number, targetPrice: number) => {
    return ((currentPrice - targetPrice) / currentPrice) * 100
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Alerts</CardTitle>
          <CardDescription>Get notified when prices drop</CardDescription>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">Loading your price alerts...</p>
        </CardContent>
      </Card>
    )
  }

  if (priceAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Alerts</CardTitle>
          <CardDescription>You haven't set any price alerts yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Set price alerts for products you're interested in, and we'll notify you when the price drops.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
        <CardDescription>Get notified when prices drop</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceAlerts.map((alert) => (
            <div key={alert.productId} className="flex items-center gap-4 p-4 border rounded-lg">
              {alert.imageUrl && (
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={alert.imageUrl || "/placeholder.svg"}
                    alt={alert.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{alert.productName}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current: </span>
                    <span>{formatPrice(alert.currentPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target: </span>
                    <span className="text-green-600">{formatPrice(alert.targetPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Savings: </span>
                    <span className="text-green-600">
                      {formatPrice(calculateSavings(alert.currentPrice, alert.targetPrice))}(
                      {calculateSavingsPercentage(alert.currentPrice, alert.targetPrice).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePriceAlert(alert.productId)}
                aria-label={`Remove alert for ${alert.productName}`}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

