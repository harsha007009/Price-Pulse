import { cache } from "react"

// Product interface to define the structure of our product data
export interface Product {
  id: string
  name: string
  description: string
  brand: string
  category: string
  images: string[]
  specifications: Record<string, string>
  prices: {
    amazon?: {
      price: number
      link: string
      inStock: boolean
      lastUpdated: Date
    }
    flipkart?: {
      price: number
      link: string
      inStock: boolean
      lastUpdated: Date
    }
    localStores?: Array<{
      name: string
      branch: string
      price: number
      inStock: boolean
      lastUpdated: Date
    }>
  }
  reviews: {
    rating: number
    count: number
  }
}

// Cache the product data to avoid excessive API calls
export const getProduct = cache(async (productId: string): Promise<Product | null> => {
  try {
    // In a real implementation, this would make an API call to our backend
    // For now, we'll simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if the product exists in our mock database
    const product = mockProducts.find((p) => p.id === productId)

    if (!product) {
      console.error(`Product with ID ${productId} not found`)
      return null
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
})

// Function to search for products
export async function searchProducts(
  query: string,
  filters?: {
    brand?: string
    minPrice?: number
    maxPrice?: number
    category?: string
  },
): Promise<Product[]> {
  try {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Filter products based on query and filters
    const results = mockProducts.filter((product) => {
      // Basic search by name
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())

      if (!matchesQuery) return false

      // Apply additional filters if provided
      if (filters) {
        if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
          return false
        }

        if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false
        }

        // Get the lowest price from all sources
        const prices = [
          product.prices.amazon?.price,
          product.prices.flipkart?.price,
          ...(product.prices.localStores?.map((store) => store.price) || []),
        ].filter(Boolean) as number[]

        const lowestPrice = Math.min(...prices)

        if (filters.minPrice !== undefined && lowestPrice < filters.minPrice) {
          return false
        }

        if (filters.maxPrice !== undefined && lowestPrice > filters.maxPrice) {
          return false
        }
      }

      return true
    })

    return results
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

// Function to get trending products
export async function getTrendingProducts(): Promise<Product[]> {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return a subset of products that are "trending"
  return mockProducts.slice(0, 4)
}

// Function to get recently tracked products
export async function getRecentlyTrackedProducts(): Promise<Product[]> {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return a different subset of products
  return [mockProducts[2], mockProducts[0], mockProducts[5]]
}

// Mock product database
const mockProducts: Product[] = [
  {
    id: "iphone-15-pro-256gb",
    name: "Apple iPhone 15 Pro (256GB)",
    description:
      "The iPhone 15 Pro features a 6.1-inch Super Retina XDR display with ProMotion technology, A17 Pro chip, and a pro camera system with 48MP main camera. It comes with a titanium design, USB-C connector, and all-day battery life.",
    brand: "Apple",
    category: "Smartphones",
    images: [
      "https://m.media-amazon.com/images/I/81fxjeu8fdL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71dN4wNJj5L._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81CgtwSII3L._SL1500_.jpg",
    ],
    specifications: {
      Display: "6.1-inch Super Retina XDR display with ProMotion",
      Processor: "A17 Pro chip",
      Camera: "48MP main camera with 5x optical zoom",
      Battery: "Up to 29 hours of video playback",
      Storage: "256GB",
      OS: "iOS 17",
      "Water Resistance": "IP68",
      Dimensions: "146.6 x 70.6 x 8.25 mm",
      Weight: "187 grams",
    },
    prices: {
      amazon: {
        price: 131900,
        link: "https://www.amazon.in/Apple-iPhone-15-Pro-256GB/dp/B0CHX1K3RV/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 129900,
        link: "https://www.flipkart.com/apple-iphone-15-pro-natural-titanium-256-gb/p/itm4a2c127a8473c",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 134000,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Cell-Point",
          branch: "Daba Gardens",
          price: 132000,
          inStock: true,
          lastUpdated: new Date("2023-06-01T09:15:00Z"),
        },
        {
          name: "Aptronix",
          branch: "Rama Talkies",
          price: 128000,
          inStock: true,
          lastUpdated: new Date("2023-06-01T11:30:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.8,
      count: 1243,
    },
  },
  {
    id: "samsung-galaxy-s23-ultra",
    name: "Samsung Galaxy S23 Ultra",
    description:
      "The Samsung Galaxy S23 Ultra features a 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 processor, and a 200MP main camera. It comes with an S Pen, 5000mAh battery, and runs on Android 13.",
    brand: "Samsung",
    category: "Smartphones",
    images: [
      "https://m.media-amazon.com/images/I/61VfL-aiToL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Dh2NhLJOL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71HbhCRhJpL._SL1500_.jpg",
    ],
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X display",
      Processor: "Snapdragon 8 Gen 2",
      Camera: "200MP main camera",
      Battery: "5000mAh",
      Storage: "256GB",
      OS: "Android 13",
      "Water Resistance": "IP68",
      Dimensions: "163.4 x 78.1 x 8.9 mm",
      Weight: "233 grams",
    },
    prices: {
      amazon: {
        price: 124999,
        link: "https://www.amazon.in/Samsung-Galaxy-Ultra-Cream-Storage/dp/B0BT9CXXXX/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 119999,
        link: "https://www.flipkart.com/samsung-galaxy-s23-ultra-5g-green-256-gb/p/itm5e8cd8c954082",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 124990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Cell-Point",
          branch: "Daba Gardens",
          price: 122000,
          inStock: true,
          lastUpdated: new Date("2023-06-01T09:15:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.7,
      count: 987,
    },
  },
  {
    id: "iphone-15-128gb",
    name: "Apple iPhone 15 (128GB)",
    description:
      "The iPhone 15 features a 6.1-inch Super Retina XDR display, A16 Bionic chip, and a dual-camera system with 48MP main camera. It comes with a durable design, USB-C connector, and all-day battery life.",
    brand: "Apple",
    category: "Smartphones",
    images: [
      "https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61f4dTush1L._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71zPdgkNQzL._SL1500_.jpg",
    ],
    specifications: {
      Display: "6.1-inch Super Retina XDR display",
      Processor: "A16 Bionic chip",
      Camera: "48MP main camera",
      Battery: "Up to 26 hours of video playback",
      Storage: "128GB",
      OS: "iOS 17",
      "Water Resistance": "IP68",
      Dimensions: "147.6 x 71.6 x 7.80 mm",
      Weight: "171 grams",
    },
    prices: {
      amazon: {
        price: 79900,
        link: "https://www.amazon.in/Apple-iPhone-15-128GB-Blue/dp/B0CHX5CHTB/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 77900,
        link: "https://www.flipkart.com/apple-iphone-15-blue-128-gb/p/itm6ac6485b71849",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 79990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Aptronix",
          branch: "Rama Talkies",
          price: 77990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T11:30:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.6,
      count: 856,
    },
  },
  {
    id: "samsung-galaxy-s23-5g",
    name: "Samsung Galaxy S23 5G",
    description:
      "The Samsung Galaxy S23 features a 6.1-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 processor, and a triple camera system. It comes with a 3900mAh battery and runs on Android 13.",
    brand: "Samsung",
    category: "Smartphones",
    images: [
      "https://m.media-amazon.com/images/I/61RZDb2mQxL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61cSFUcYFFL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Zb0xrW+GL._SL1500_.jpg",
    ],
    specifications: {
      Display: "6.1-inch Dynamic AMOLED 2X display",
      Processor: "Snapdragon 8 Gen 2",
      Camera: "50MP main camera",
      Battery: "3900mAh",
      Storage: "128GB",
      OS: "Android 13",
      "Water Resistance": "IP68",
      Dimensions: "146.3 x 70.9 x 7.6 mm",
      Weight: "168 grams",
    },
    prices: {
      amazon: {
        price: 64999,
        link: "https://www.amazon.in/Samsung-Galaxy-Phantom-Black-Storage/dp/B0BT9CXXXX/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 62999,
        link: "https://www.flipkart.com/samsung-galaxy-s23-5g-phantom-black-128-gb/p/itm5b12e8bf9d402",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 64990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Cell-Point",
          branch: "Daba Gardens",
          price: 63500,
          inStock: true,
          lastUpdated: new Date("2023-06-01T09:15:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.5,
      count: 742,
    },
  },
  {
    id: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description:
      "Industry-leading noise cancellation, exceptional sound quality, and crystal-clear calls. The WH-1000XM5 headphones feature multiple microphones and Auto NC Optimizer for unparalleled noise cancellation.",
    brand: "Sony",
    category: "Headphones",
    images: [
      "https://m.media-amazon.com/images/I/61+btxzpfDL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Zp5XdONyL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71O+WlGJXBL._SL1500_.jpg",
    ],
    specifications: {
      Type: "Over-ear wireless headphones",
      "Noise Cancellation": "Active Noise Cancellation",
      "Battery Life": "Up to 30 hours",
      Connectivity: "Bluetooth 5.2, 3.5mm audio cable",
      Weight: "250 grams",
      Charging: "USB-C",
      Features: "Touch controls, Speak-to-chat, Multipoint connection",
    },
    prices: {
      amazon: {
        price: 29990,
        link: "https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Wireless-Headphones/dp/B09XS7JWHH/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 28990,
        link: "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm7987c1e6d2a79",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
    },
    reviews: {
      rating: 4.7,
      count: 532,
    },
  },
  {
    id: "macbook-air-m2",
    name: "Apple MacBook Air M2 (2022)",
    description:
      "The MacBook Air with M2 chip features a 13.6-inch Liquid Retina display, 8-core CPU, up to 24GB unified memory, and up to 18 hours of battery life. It comes with a MagSafe charging port and a 1080p FaceTime HD camera.",
    brand: "Apple",
    category: "Laptops",
    images: [
      "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61L5QgPvgqL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71YdM4wm8eL._SL1500_.jpg",
    ],
    specifications: {
      Display: "13.6-inch Liquid Retina display",
      Processor: "Apple M2 chip",
      Memory: "8GB unified memory",
      Storage: "256GB SSD",
      Battery: "Up to 18 hours",
      Camera: "1080p FaceTime HD camera",
      Ports: "MagSafe charging port, Two Thunderbolt / USB 4 ports",
      Weight: "1.24 kg",
    },
    prices: {
      amazon: {
        price: 99900,
        link: "https://www.amazon.in/Apple-MacBook-Laptop-Midnight-Storage/dp/B0B3BQ11LP/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 97900,
        link: "https://www.flipkart.com/apple-macbook-air-m2-8-gb-256-gb-ssd-mac-os-ventura-mly33hn-a/p/itm6a5f9e2a2d2e0",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 99990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Aptronix",
          branch: "Rama Talkies",
          price: 98990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T11:30:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.8,
      count: 623,
    },
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12 5G",
    description:
      "The OnePlus 12 features a 6.82-inch LTPO AMOLED display, Snapdragon 8 Gen 3 processor, and a triple camera system co-developed with Hasselblad. It comes with a 5400mAh battery with 100W fast charging.",
    brand: "OnePlus",
    category: "Smartphones",
    images: [
      "https://m.media-amazon.com/images/I/71K84j2O8lL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61yQSMsYBTL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71sCJzJLpJL._SL1500_.jpg",
    ],
    specifications: {
      Display: "6.82-inch LTPO AMOLED display",
      Processor: "Snapdragon 8 Gen 3",
      Camera: "50MP main camera with Hasselblad tuning",
      Battery: "5400mAh with 100W fast charging",
      Storage: "256GB",
      OS: "OxygenOS based on Android 14",
      "Water Resistance": "IP68",
      Dimensions: "164.3 x 75.8 x 9.2 mm",
      Weight: "220 grams",
    },
    prices: {
      amazon: {
        price: 64999,
        link: "https://www.amazon.in/OnePlus-Flowy-Emerald-256GB-Storage/dp/B0CQPKVZB8/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 62999,
        link: "https://www.flipkart.com/oneplus-12-5g-flowy-emerald-256-gb/p/itm1c22df5ce7e0c",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
    },
    reviews: {
      rating: 4.6,
      count: 412,
    },
  },
  {
    id: "samsung-double-door-refrigerator",
    name: "Samsung 580L Double Door Refrigerator",
    description:
      "Samsung 580L Double Door Refrigerator with Digital Inverter Technology, Frost Free, and Multi Flow Cooling. Features Twin Cooling Plus to maintain optimal humidity levels and prevent odor transfer between compartments.",
    brand: "Samsung",
    category: "Home Appliances",
    images: [
      "https://m.media-amazon.com/images/I/71QT7dSK4ZL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71KCwNV6MuL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Qe6xlhwBL._SL1500_.jpg",
    ],
    specifications: {
      Capacity: "580 Liters",
      "Energy Rating": "3 Star",
      "Cooling Technology": "Digital Inverter Technology",
      "Defrost System": "Frost Free",
      "Door Style": "Double Door",
      "Shelf Type": "Toughened Glass",
      Dimensions: "178.5 x 83.6 x 73.4 cm",
      Weight: "85 kg",
    },
    prices: {
      amazon: {
        price: 68990,
        link: "https://www.amazon.in/Samsung-Refrigerator-RT61K7058BS-Inverter-Technology/dp/B084LJKZ3M/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 67490,
        link: "https://www.flipkart.com/samsung-580-l-frost-free-side-by-side-refrigerator/p/itm123456789",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 69990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Croma",
          branch: "Gajuwaka",
          price: 68500,
          inStock: true,
          lastUpdated: new Date("2023-06-01T09:15:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.5,
      count: 328,
    },
  },
  {
    id: "lg-front-load-washing-machine",
    name: "LG 8kg Front Load Washing Machine",
    description:
      "LG 8kg Front Load Washing Machine with Steam Technology, 6 Motion Direct Drive, and Smart Diagnosis. Features TurboWash technology for faster and more efficient washing cycles.",
    brand: "LG",
    category: "Home Appliances",
    images: [
      "https://m.media-amazon.com/images/I/71o1csyWIzL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Zf9uUp+GL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Oc3Y78OBL._SL1500_.jpg",
    ],
    specifications: {
      Capacity: "8 kg",
      "Energy Rating": "5 Star",
      "Washing Method": "Front Load",
      "Spin Speed": "1400 RPM",
      "Wash Programs": "14 Programs",
      "Special Features": "Steam Wash, TurboWash, Smart Diagnosis",
      Dimensions: "60 x 56 x 85 cm",
      Weight: "65 kg",
    },
    prices: {
      amazon: {
        price: 42990,
        link: "https://www.amazon.in/LG-Inverter-Fully-Automatic-FHM1408BDM/dp/B08698C78N/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 41490,
        link: "https://www.flipkart.com/lg-8-kg-fully-automatic-front-load-washing-machine/p/itm987654321",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Daba Gardens",
          price: 43990,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
        {
          name: "Aptronix",
          branch: "Rama Talkies",
          price: 42500,
          inStock: true,
          lastUpdated: new Date("2023-06-01T11:30:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.6,
      count: 256,
    },
  },
  {
    id: "nike-air-zoom-pegasus",
    name: "Nike Air Zoom Pegasus 39 Running Shoes",
    description:
      "Nike Air Zoom Pegasus 39 is a versatile daily trainer with responsive cushioning. Features Zoom Air units for springy steps and a breathable mesh upper for comfort during long runs.",
    brand: "Nike",
    category: "Shoes",
    images: [
      "https://m.media-amazon.com/images/I/71+xW6RKHgL._UL1500_.jpg",
      "https://m.media-amazon.com/images/I/71czu7WgGuL._UL1500_.jpg",
      "https://m.media-amazon.com/images/I/81Vw6uzR8HL._UL1500_.jpg",
    ],
    specifications: {
      Type: "Running Shoes",
      Gender: "Unisex",
      Material: "Mesh Upper, Rubber Sole",
      Cushioning: "Zoom Air Units",
      Closure: "Lace-up",
      "Arch Type": "Neutral",
      "Special Features": "Breathable, Lightweight, Responsive",
      "Care Instructions": "Wipe with a clean, dry cloth",
    },
    prices: {
      amazon: {
        price: 9995,
        link: "https://www.amazon.in/Nike-Pegasus-Running-Shoes-DH4071-001/dp/B09TMNVF8L/",
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      flipkart: {
        price: 9495,
        link: "https://www.flipkart.com/nike-air-zoom-pegasus-39-running-shoes/p/itm246813579",
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      localStores: [
        {
          name: "Nike Store",
          branch: "Forum Mall",
          price: 9999,
          inStock: true,
          lastUpdated: new Date("2023-06-01T10:00:00Z"),
        },
      ],
    },
    reviews: {
      rating: 4.7,
      count: 412,
    },
  },
]

