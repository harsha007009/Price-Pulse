"use client"

import type React from "react"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LocationSettings() {
  const [formData, setFormData] = useState({
    address: "123 Main St, San Francisco, CA 94105",
    useCurrentLocation: true,
    searchRadius: "10",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, useCurrentLocation: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, searchRadius: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the location settings to an API
    console.log("Saving location settings:", formData)
    // Show success notification
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Settings
        </CardTitle>
        <CardDescription>Configure your location preferences for local store searches</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Default Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={formData.useCurrentLocation}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="useCurrentLocation">Use current location</Label>
            <Switch
              id="useCurrentLocation"
              checked={formData.useCurrentLocation}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="searchRadius">Search Radius</Label>
            <Select value={formData.searchRadius} onValueChange={handleSelectChange}>
              <SelectTrigger id="searchRadius">
                <SelectValue placeholder="Select search radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">Save Location Settings</Button>
        </form>
      </CardContent>
    </Card>
  )
}

