"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ExternalLink, MapPin, Edit, Trash2, Bell, AlertCircle, Pencil, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

// Define the user type
interface UserProfile {
  name: string;
  email: string;
  location: string;
  memberSince: string;
  avatarUrl: string;
  username?: string;
}

export function UserProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the current user data
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/user/profile')
        
        if (response.status === 401) {
          // Unauthorized, redirect to login
          router.push('/auth/signin?callbackUrl=/profile')
          return
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Use mock data as a fallback
        setUser(mockUser)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [router])

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      
      // Redirect to the sign-in page
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Mock user as fallback data
  const mockUser = {
    name: "User",
    email: "user@example.com",
    location: "Visakhapatnam",
    memberSince: "January 2023",
    avatarUrl: "/placeholder-user.jpg",
  }

  // Price alerts data
  const priceAlerts = [
    {
      id: "alert-1",
      productId: "iphone-15-pro-max",
      productName: "iPhone 15 Pro Max",
      currentPrice: 159900,
      targetPrice: 145000,
      progress: 90
    },
    {
      id: "alert-2",
      productId: "lg-washing-machine",
      productName: "LG 8kg Front Load Washing Machine",
      currentPrice: 42990,
      targetPrice: 38000,
      progress: 88
    },
    {
      id: "alert-3",
      productId: "samsung-refrigerator",
      productName: "Samsung 580L Refrigerator",
      currentPrice: 67490,
      targetPrice: 60000,
      progress: 89
    }
  ]

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false
  })

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Function to handle notification toggle
  const handleNotificationToggle = (type: 'email' | 'push' | 'sms') => {
    setNotificationSettings({
      ...notificationSettings,
      [type]: !notificationSettings[type]
    })
  }

  // Show loading indicator while fetching user data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const activeUser = user || mockUser

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        {/* Left column with profile and settings */}
        <div className="space-y-6">
          {/* User info card */}
          <Card className="overflow-hidden border-gray-800">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold">{activeUser.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold">{activeUser.name}</h2>
              <p className="text-gray-400 text-sm mb-2">{activeUser.email}</p>
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{activeUser.location}</span>
              </div>
              <p className="text-sm text-gray-500">Member since {activeUser.memberSince}</p>
              <Button variant="outline" className="mt-6" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings Section */}
          <Card className="border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Notification Settings</h2>
              <p className="text-sm text-gray-400 mb-4">Manage how you receive alerts</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Alerts</h3>
                    <p className="text-sm text-gray-500">{activeUser.email}</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Browser notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.push}
                    onCheckedChange={() => handleNotificationToggle('push')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Alerts</h3>
                    <p className="text-sm text-gray-500">+91 9876543210</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.sms}
                    onCheckedChange={() => handleNotificationToggle('sms')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Section */}
          <Card className="border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <div className="space-y-2">
                <Link href="/settings/personal" className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md">
                  <span className="font-medium">Personal Information</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link href="/settings/security" className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md">
                  <span className="font-medium">Security</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link href="/settings/preferences" className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md">
                  <span className="font-medium">Preferences</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link href="/settings/data" className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md">
                  <span className="font-medium">Data & Privacy</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-between w-full p-2 hover:bg-red-900/20 hover:text-red-400 rounded-md text-left"
                >
                  <span className="font-medium">Sign Out</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area with tabs */}
        <div>
          <Tabs defaultValue="price-alerts">
            <TabsList className="bg-gray-900 w-full grid grid-cols-3">
              <TabsTrigger 
                value="tracked-products" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-3"
              >
                Tracked Products
              </TabsTrigger>
              <TabsTrigger 
                value="price-alerts" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-3"
              >
                Price Alerts
              </TabsTrigger>
              <TabsTrigger 
                value="price-history" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-3"
              >
                Price History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="price-alerts" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Price Alerts</h2>
                <Button className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Create New Alert
                </Button>
              </div>
              
              <div className="space-y-0">
                {priceAlerts.map((alert) => (
                  <div key={alert.id} className="border-b border-gray-800 py-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold">{alert.productName}</h3>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium">{alert.progress}%</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-3">
                      <span>Current: {formatPrice(alert.currentPrice)}</span>
                      <span className="mx-2">•</span>
                      <span>Target: {formatPrice(alert.targetPrice)}</span>
                    </div>
                    <div>
                      <Progress 
                        value={alert.progress} 
                        className="h-1 bg-gray-800" 
                        indicatorClassName="bg-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tracked-products">
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Your Tracked Products</h2>
                <p className="text-gray-400">No tracked products yet. Start tracking products to see them here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="price-history">
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Price History</h2>
                <p className="text-gray-400">Select a product to view its price history.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}