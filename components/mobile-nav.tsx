"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ActivitySquare, Home, Map, Menu, Search, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      active: pathname.startsWith("/search"),
    },
    {
      href: "/nearby",
      label: "Nearby",
      icon: Map,
      active: pathname.startsWith("/nearby"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <ActivitySquare className="h-6 w-6" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Price Pulse
            </span>
          </Link>
        </div>
        <div className="mt-8 px-7">
          <div className="flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-lg font-medium transition-colors",
                  route.active ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

