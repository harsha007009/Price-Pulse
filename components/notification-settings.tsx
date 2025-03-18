"use client"

import type React from "react"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    priceDrops: true,
    newDeals: true,
    localStores: false,
    productAvailability: true,
    email: true,
    push: true,
  })

  const handleChange = (key: string, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the notification settings to an API
    console.log("Saving notification settings:", notifications)
    // Show success notification
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Control when and how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Types</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="priceDrops" className="flex-1">
                Price drops on tracked products
              </Label>
              <Switch
                id="priceDrops"
                checked={notifications.priceDrops}
                onCheckedChange={(checked) => handleChange("priceDrops", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="newDeals" className="flex-1">
                New deals and discounts
              </Label>
              <Switch
                id="newDeals"
                checked={notifications.newDeals}
                onCheckedChange={(checked) => handleChange("newDeals", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="localStores" className="flex-1">
                Local store availability
              </Label>
              <Switch
                id="localStores"
                checked={notifications.localStores}
                onCheckedChange={(checked) => handleChange("localStores", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="productAvailability" className="flex-1">
                Product back in stock
              </Label>
              <Switch
                id="productAvailability"
                checked={notifications.productAvailability}
                onCheckedChange={(checked) => handleChange("productAvailability", checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Channels</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex-1">
                Email notifications
              </Label>
              <Switch
                id="email"
                checked={notifications.email}
                onCheckedChange={(checked) => handleChange("email", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="flex-1">
                Push notifications
              </Label>
              <Switch
                id="push"
                checked={notifications.push}
                onCheckedChange={(checked) => handleChange("push", checked)}
              />
            </div>
          </div>

          <Button type="submit">Save Preferences</Button>
        </form>
      </CardContent>
    </Card>
  )
}

