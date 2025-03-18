"use client"

import type React from "react"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface SetPriceAlertProps {
  productId: string
  currentPrice: number
}

export function SetPriceAlert({ productId, currentPrice }: SetPriceAlertProps) {
  const [open, setOpen] = useState(false)
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the alert data to an API
    console.log("Setting price alert for product", productId, "at", targetPrice)
    setOpen(false)
    // Show success notification
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>We'll notify you when the price drops below your target price.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="price">Target Price</Label>
                <span className="text-sm font-medium">₹{targetPrice.toLocaleString("en-IN")}</span>
              </div>
              <Slider
                id="price"
                min={Math.floor(currentPrice * 0.5)}
                max={currentPrice}
                step={1000}
                value={[targetPrice]}
                onValueChange={(value) => setTargetPrice(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹{Math.floor(currentPrice * 0.5).toLocaleString("en-IN")}</span>
                <span>₹{currentPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Alert</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

