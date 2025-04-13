"use client"

import { useState, useEffect, ReactNode } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Home, MapPin, Menu, Moon, Search, Sun, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Ensure theme-related code only runs on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Price Pulse</span>
            </Link>
            <nav className="hidden md:flex">
              <ul className="flex items-center gap-6">
                <li>
                  <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                    Search
                  </Link>
                </li>
                <li>
                  <Link href="/nearby" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <MapPin className="h-4 w-4" />
                    Nearby
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="mr-2 h-4 w-4" />
                  Change Location
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="grid gap-6 py-6">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">Price Pulse</span>
                  </Link>
                  <nav>
                    <ul className="grid gap-4">
                      <li>
                        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Home className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/search"
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <Search className="h-4 w-4" />
                          Search
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/nearby"
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <MapPin className="h-4 w-4" />
                          Nearby
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              Price Pulse
            </Link>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Price Pulse. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}