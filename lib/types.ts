export interface Price {
  price: number
  link: string
  inStock: boolean
  lastUpdated: string
  seller?: string
}

export interface LocalStore {
  name: string
  branch: string
  address: string
  phone?: string
  website?: string
  price: number
  inStock: boolean
  lastUpdated: string
  distance?: string
}

export interface OnlineStore {
  name: string
  price: number
  url: string
}

export interface Prices {
  amazon: Price
  flipkart: Price
  localStores: LocalStore[]
  onlineStores: OnlineStore[]
}

export interface Reviews {
  rating: number
  count: number
}

export interface Specifications {
  [key: string]: string | number
}

export interface ProductPrices {
  current: number
  original?: number
  localStores: LocalStore[]
  onlineStores: OnlineStore[]
  history: PriceHistoryPoint[]
}

export interface PriceHistoryPoint {
  date: string
  price: number
  source: string
}

export interface Product {
  _id: string
  id: string
  name: string
  brand: string
  category: string
  description: string
  images: string[]
  specifications: Record<string, string>
  prices: ProductPrices
  reviews: {
    rating: number
    count: number
  }
  createdAt: string
  updatedAt: string
} 