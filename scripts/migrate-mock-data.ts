import { MongoClient } from 'mongodb';

interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  images: string[];
  specifications: Record<string, string>;
  prices: {
    amazon?: {
      price: number;
      link: string;
      inStock: boolean;
      lastUpdated: Date;
    };
    flipkart?: {
      price: number;
      link: string;
      inStock: boolean;
      lastUpdated: Date;
    };
    localStores?: Array<{
      name: string;
      branch: string;
      price: number;
      inStock: boolean;
      lastUpdated: Date;
    }>;
  };
  reviews: {
    rating: number;
    count: number;
  };
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "iphone-15-pro-256gb",
    name: "Apple iPhone 15 Pro (256GB)",
    description: "The iPhone 15 Pro features a 6.1-inch Super Retina XDR display with ProMotion technology and A17 Pro chip.",
    brand: "Apple",
    category: "Smartphones",
    images: ["https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg"],
    specifications: {
      Display: "6.1-inch Super Retina XDR OLED",
      Storage: "256GB",
      Processor: "A17 Pro chip",
      Camera: "48MP + 12MP + 12MP"
    },
    prices: {
      amazon: {
        price: 131900,
        link: "https://amazon.in/iphone15pro",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 129900,
        link: "https://flipkart.com/iphone15pro",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Poorvika Mobiles",
          branch: "Dwaraka Nagar",
          price: 130000,
          inStock: true,
          lastUpdated: new Date()
        },
        {
          name: "Bajaj Electronics",
          branch: "CMR Central Mall",
          price: 131000,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.5,
      count: 100
    }
  },
  {
    id: "samsung-s23-ultra-256gb",
    name: "Samsung Galaxy S23 Ultra (256GB)",
    description: "The Galaxy S23 Ultra features a 6.8-inch Dynamic AMOLED display and 200MP camera system.",
    brand: "Samsung",
    category: "Smartphones",
    images: ["https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg"],
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X",
      Storage: "256GB",
      Processor: "Snapdragon 8 Gen 2",
      Camera: "200MP + 12MP + 10MP + 10MP"
    },
    prices: {
      amazon: {
        price: 124999,
        link: "https://amazon.in/s23ultra",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 123999,
        link: "https://flipkart.com/s23ultra",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Samsung Smart Plaza",
          branch: "Jagadamba Junction",
          price: 124500,
          inStock: true,
          lastUpdated: new Date()
        },
        {
          name: "Reliance Digital",
          branch: "Waltair Uplands",
          price: 125000,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 85
    }
  },
  {
    id: "macbook-air-m2",
    name: "Apple MacBook Air M2 (8GB/256GB)",
    description: "The MacBook Air M2 features Apple's latest M2 chip and a stunning 13.6-inch Liquid Retina display.",
    brand: "Apple",
    category: "Laptops",
    images: ["https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-m2-2022-1.jpg"],
    specifications: {
      Display: "13.6-inch Liquid Retina",
      Storage: "256GB SSD",
      Processor: "Apple M2 chip",
      Memory: "8GB unified memory"
    },
    prices: {
      amazon: {
        price: 114900,
        link: "https://amazon.in/macbook-air-m2",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 113999,
        link: "https://flipkart.com/macbook-air-m2",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "iStore",
          branch: "Dwaraka Nagar",
          price: 114500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.7,
      count: 45
    }
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancelling headphones with exceptional sound quality.",
    brand: "Sony",
    category: "Audio",
    images: ["https://www.sony.co.in/image/5d02da5df552836db894d0c381b48a7f"],
    specifications: {
      Type: "Over-ear",
      Battery: "Up to 30 hours",
      NoiseCancelling: "Yes",
      Connectivity: "Bluetooth 5.2"
    },
    prices: {
      amazon: {
        price: 26990,
        link: "https://amazon.in/sony-wh1000xm5",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 26499,
        link: "https://flipkart.com/sony-wh1000xm5",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Croma",
          branch: "Vizag Central",
          price: 26999,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 32
    }
  },
  {
    id: "lg-oled-c3-65",
    name: "LG OLED C3 65-inch 4K Smart TV",
    description: "65-inch 4K OLED TV with AI processing and perfect blacks.",
    brand: "LG",
    category: "TVs",
    images: ["https://www.lg.com/in/images/tvs/md07554739/gallery/C3_1.jpg"],
    specifications: {
      Display: "65-inch 4K OLED",
      HDR: "Dolby Vision IQ",
      Processor: "α9 Gen6 AI",
      SmartTV: "webOS 23"
    },
    prices: {
      amazon: {
        price: 249999,
        link: "https://amazon.in/lg-oled-c3",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 248999,
        link: "https://flipkart.com/lg-oled-c3",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "LG Best Shop",
          branch: "Gajuwaka",
          price: 249500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.8,
      count: 25
    }
  },
  {
    id: "samsung-qn90c-65",
    name: "Samsung Neo QLED QN90C 65-inch TV",
    description: "65-inch Neo QLED 4K TV with Quantum Matrix Technology.",
    brand: "Samsung",
    category: "TVs",
    images: ["https://images.samsung.com/is/image/samsung/p6pim/in/qa65qn90caklxl/gallery/in-qled-qn90c-qa65qn90caklxl-thumb-537241119"],
    specifications: {
      Display: "65-inch Neo QLED 4K",
      HDR: "Quantum HDR 32X",
      Processor: "Neural Quantum Processor 4K",
      SmartTV: "Tizen"
    },
    prices: {
      amazon: {
        price: 239999,
        link: "https://amazon.in/samsung-qn90c",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 238999,
        link: "https://flipkart.com/samsung-qn90c",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Samsung Smart Plaza",
          branch: "Jagadamba Junction",
          price: 239500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.7,
      count: 28
    }
  },
  {
    id: "dell-xps-13-plus",
    name: "Dell XPS 13 Plus (12th Gen i7)",
    description: "Premium ultrabook with 12th Gen Intel Core i7 and InfinityEdge display.",
    brand: "Dell",
    category: "Laptops",
    images: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs9320t-xnb-shot-5-1-sl.psd"],
    specifications: {
      Processor: "12th Gen Intel Core i7",
      Memory: "16GB LPDDR5",
      Storage: "512GB SSD",
      Display: "13.4-inch 3.5K OLED"
    },
    prices: {
      amazon: {
        price: 159990,
        link: "https://amazon.in/dell-xps-13-plus",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 158990,
        link: "https://flipkart.com/dell-xps-13-plus",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Dell Exclusive Store",
          branch: "Asilmetta Junction",
          price: 159500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 35
    }
  },
  {
    id: "canon-eos-r6-mark-ii",
    name: "Canon EOS R6 Mark II",
    description: "Full-frame mirrorless camera with advanced autofocus and 4K video.",
    brand: "Canon",
    category: "Cameras",
    images: ["https://in.canon/media/image/2022/11/02/e6ddd2b4e8a940d69b82b9c21f5fe2b5_EOS+R6+Mark+II+RF24-105mm+f4-7.1+IS+STM+Front+Slant.png"],
    specifications: {
      Sensor: "24.2MP Full-frame CMOS",
      ISO: "100-102400",
      Video: "4K 60p",
      Stabilization: "5-axis IBIS"
    },
    prices: {
      amazon: {
        price: 249990,
        link: "https://amazon.in/canon-eos-r6-ii",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 248990,
        link: "https://flipkart.com/canon-eos-r6-ii",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Canon Image Square",
          branch: "MVP Colony",
          price: 249500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.8,
      count: 22
    }
  },
  {
    id: "sony-a7-iv",
    name: "Sony A7 IV Mirrorless Camera",
    description: "Full-frame mirrorless camera with 33MP sensor and advanced AF.",
    brand: "Sony",
    category: "Cameras",
    images: ["https://www.sony.co.in/image/5d02da5df552836db894d0c381b48a7f"],
    specifications: {
      Sensor: "33MP Full-frame CMOS",
      ISO: "100-51200",
      Video: "4K 60p 10-bit",
      Stabilization: "5-axis IBIS"
    },
    prices: {
      amazon: {
        price: 239990,
        link: "https://amazon.in/sony-a7-iv",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 238990,
        link: "https://flipkart.com/sony-a7-iv",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Sony Center",
          branch: "Dwaraka Nagar",
          price: 239500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.7,
      count: 30
    }
  },
  {
    id: "apple-watch-series-9",
    name: "Apple Watch Series 9 (GPS + Cellular)",
    description: "Latest Apple Watch with S9 chip and advanced health features.",
    brand: "Apple",
    category: "Wearables",
    images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-s9-digitalmat-gallery-1-202309_GEO_IN"],
    specifications: {
      Display: "Always-On Retina",
      Processor: "S9 chip",
      Storage: "32GB",
      WaterResistant: "50m"
    },
    prices: {
      amazon: {
        price: 49900,
        link: "https://amazon.in/apple-watch-s9",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 48900,
        link: "https://flipkart.com/apple-watch-s9",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "iStore",
          branch: "Dwaraka Nagar",
          price: 49500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 40
    }
  },
  {
    id: "samsung-galaxy-watch-6",
    name: "Samsung Galaxy Watch 6 Classic",
    description: "Premium smartwatch with rotating bezel and advanced health tracking.",
    brand: "Samsung",
    category: "Wearables",
    images: ["https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-classic-470792-sm-r960nzsains-thumb-537234542"],
    specifications: {
      Display: "1.5-inch Super AMOLED",
      Processor: "Exynos W930",
      Storage: "16GB",
      WaterResistant: "5ATM + IP68"
    },
    prices: {
      amazon: {
        price: 39999,
        link: "https://amazon.in/galaxy-watch-6",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 38999,
        link: "https://flipkart.com/galaxy-watch-6",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Samsung Smart Plaza",
          branch: "Jagadamba Junction",
          price: 39500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.5,
      count: 35
    }
  },
  {
    id: "lg-gram-17",
    name: "LG Gram 17 (2023)",
    description: "Ultra-lightweight 17-inch laptop with long battery life.",
    brand: "LG",
    category: "Laptops",
    images: ["https://www.lg.com/in/images/laptops/md07554966/gallery/17Z90R-1.jpg"],
    specifications: {
      Display: "17-inch WQXGA IPS",
      Processor: "13th Gen Intel Core i7",
      Memory: "16GB LPDDR5",
      Storage: "1TB NVMe SSD"
    },
    prices: {
      amazon: {
        price: 149990,
        link: "https://amazon.in/lg-gram-17",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 148990,
        link: "https://flipkart.com/lg-gram-17",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "LG Best Shop",
          branch: "Gajuwaka",
          price: 149500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 28
    }
  },
  {
    id: "bose-qc45",
    name: "Bose QuietComfort 45",
    description: "Premium noise cancelling headphones with exceptional comfort.",
    brand: "Bose",
    category: "Audio",
    images: ["https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc45/product_silo_images/QC45_PDP_Gallery-01.png"],
    specifications: {
      Type: "Over-ear",
      Battery: "24 hours",
      NoiseCancelling: "Yes",
      Connectivity: "Bluetooth 5.1"
    },
    prices: {
      amazon: {
        price: 29900,
        link: "https://amazon.in/bose-qc45",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 28900,
        link: "https://flipkart.com/bose-qc45",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Croma",
          branch: "Vizag Central",
          price: 29500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.7,
      count: 42
    }
  },
  {
    id: "ipad-pro-12-9",
    name: "Apple iPad Pro 12.9-inch (2022)",
    description: "12.9-inch iPad Pro with M2 chip and Liquid Retina XDR display.",
    brand: "Apple",
    category: "Tablets",
    images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202210"],
    specifications: {
      Display: "12.9-inch Liquid Retina XDR",
      Processor: "Apple M2 chip",
      Storage: "256GB",
      Camera: "12MP Wide + 10MP Ultra Wide"
    },
    prices: {
      amazon: {
        price: 119900,
        link: "https://amazon.in/ipad-pro-12-9",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 118900,
        link: "https://flipkart.com/ipad-pro-12-9",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "iStore",
          branch: "Dwaraka Nagar",
          price: 119500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.8,
      count: 36
    }
  },
  {
    id: "samsung-tab-s9-ultra",
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "14.6-inch Android tablet with S Pen and productivity features.",
    brand: "Samsung",
    category: "Tablets",
    images: ["https://images.samsung.com/is/image/samsung/p6pim/in/sm-x910nzaeinu/gallery/in-galaxy-tab-s9-ultra-wifi-x910-sm-x910nzaeinu-thumb-537234431"],
    specifications: {
      Display: "14.6-inch Super AMOLED",
      Processor: "Snapdragon 8 Gen 2",
      Storage: "256GB",
      Battery: "11200mAh"
    },
    prices: {
      amazon: {
        price: 119999,
        link: "https://amazon.in/galaxy-tab-s9-ultra",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 118999,
        link: "https://flipkart.com/galaxy-tab-s9-ultra",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Samsung Smart Plaza",
          branch: "Jagadamba Junction",
          price: 119500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.7,
      count: 32
    }
  },
  {
    id: "asus-rog-phone-7",
    name: "ASUS ROG Phone 7 Ultimate",
    description: "Gaming smartphone with advanced cooling and 165Hz display.",
    brand: "ASUS",
    category: "Smartphones",
    images: ["https://dlcdnwebimgs.asus.com/files/media/B1D424A6-3752-44EF-9BCE-042CD6D5F18E/v1/images/large/1__1_.png"],
    specifications: {
      Display: "6.78-inch AMOLED 165Hz",
      Processor: "Snapdragon 8 Gen 2",
      Storage: "512GB",
      Battery: "6000mAh"
    },
    prices: {
      amazon: {
        price: 99999,
        link: "https://amazon.in/rog-phone-7",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 98999,
        link: "https://flipkart.com/rog-phone-7",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Reliance Digital",
          branch: "Waltair Uplands",
          price: 99500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 25
    }
  },
  {
    id: "oneplus-11",
    name: "OnePlus 11 5G",
    description: "Flagship smartphone with Hasselblad cameras and fast charging.",
    brand: "OnePlus",
    category: "Smartphones",
    images: ["https://image01.oneplus.net/ebp/202301/04/1-m00-45-dd-rb8lb2o1xeaawblaaamyhjhy1qm011.png"],
    specifications: {
      Display: "6.7-inch AMOLED 120Hz",
      Processor: "Snapdragon 8 Gen 2",
      Storage: "256GB",
      Camera: "50MP + 48MP + 32MP"
    },
    prices: {
      amazon: {
        price: 61999,
        link: "https://amazon.in/oneplus-11",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 60999,
        link: "https://flipkart.com/oneplus-11",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Poorvika Mobiles",
          branch: "Dwaraka Nagar",
          price: 61500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.5,
      count: 48
    }
  },
  {
    id: "hp-envy-x360",
    name: "HP Envy x360 (2023)",
    description: "Convertible laptop with OLED display and pen support.",
    brand: "HP",
    category: "Laptops",
    images: ["https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08473217_1.png"],
    specifications: {
      Display: "15.6-inch OLED Touch",
      Processor: "13th Gen Intel Core i7",
      Memory: "16GB DDR5",
      Storage: "1TB SSD"
    },
    prices: {
      amazon: {
        price: 124990,
        link: "https://amazon.in/hp-envy-x360",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 123990,
        link: "https://flipkart.com/hp-envy-x360",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "HP World",
          branch: "MVP Colony",
          price: 124500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.5,
      count: 38
    }
  },
  {
    id: "sony-bravia-x90l",
    name: "Sony BRAVIA XR X90L",
    description: "65-inch 4K LED TV with cognitive processor XR.",
    brand: "Sony",
    category: "TVs",
    images: ["https://www.sony.co.in/image/5d02da5df552836db894d0c381b48a7f"],
    specifications: {
      Display: "65-inch 4K HDR",
      Processor: "Cognitive Processor XR",
      HDR: "Dolby Vision",
      SmartTV: "Google TV"
    },
    prices: {
      amazon: {
        price: 179990,
        link: "https://amazon.in/sony-bravia-x90l",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 178990,
        link: "https://flipkart.com/sony-bravia-x90l",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Sony Center",
          branch: "Dwaraka Nagar",
          price: 179500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.6,
      count: 30
    }
  },
  {
    id: "garmin-fenix-7x",
    name: "Garmin Fenix 7X Solar",
    description: "Premium multisport GPS watch with solar charging.",
    brand: "Garmin",
    category: "Wearables",
    images: ["https://www.garmin.co.in/m/in/g/products/fenix7x-solar_1.jpg"],
    specifications: {
      Display: "1.4-inch transflective",
      Battery: "Up to 37 days",
      GPS: "Multi-band GNSS",
      WaterRating: "10 ATM"
    },
    prices: {
      amazon: {
        price: 99990,
        link: "https://amazon.in/garmin-fenix-7x",
        inStock: true,
        lastUpdated: new Date()
      },
      flipkart: {
        price: 98990,
        link: "https://flipkart.com/garmin-fenix-7x",
        inStock: true,
        lastUpdated: new Date()
      },
      localStores: [
        {
          name: "Helios - The Watch Store",
          branch: "CMR Central Mall",
          price: 99500,
          inStock: true,
          lastUpdated: new Date()
        }
      ]
    },
    reviews: {
      rating: 4.8,
      count: 22
    }
  }
];

// Convert Date objects to ISOString for MongoDB storage
const processProducts = (products: any[]) => {
  return products.map(product => ({
    ...product,
    prices: {
      ...product.prices,
      amazon: product.prices.amazon ? {
        ...product.prices.amazon,
        lastUpdated: new Date(product.prices.amazon.lastUpdated).toISOString()
      } : undefined,
      flipkart: product.prices.flipkart ? {
        ...product.prices.flipkart,
        lastUpdated: new Date(product.prices.flipkart.lastUpdated).toISOString()
      } : undefined,
      localStores: product.prices.localStores?.map(store => ({
        ...store,
        lastUpdated: new Date(store.lastUpdated).toISOString()
      }))
    }
  }));
};

interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  images: string[];
  specifications: Record<string, string>;
  prices: {
    amazon?: {
      price: number;
      link: string;
      inStock: boolean;
      lastUpdated: Date;
    };
    flipkart?: {
      price: number;
      link: string;
      inStock: boolean;
      lastUpdated: Date;
    };
    localStores?: Array<{
      name: string;
      branch: string;
      price: number;
      inStock: boolean;
      lastUpdated: Date;
    }>;
  };
  reviews: {
    rating: number;
    count: number;
  };
}

// MongoDB collections
const COLLECTIONS = {
  PRODUCTS: 'products',
  STORES: 'stores',
  PRICE_HISTORY: 'priceHistory'
};

async function migrateData() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env');
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db();

    // Clear existing collections
    await Promise.all([
      db.collection(COLLECTIONS.PRODUCTS).deleteMany({}),
      db.collection(COLLECTIONS.STORES).deleteMany({}),
      db.collection(COLLECTIONS.PRICE_HISTORY).deleteMany({})
    ]);

    // Extract unique stores from products
    const stores = new Set();
    mockProducts.forEach(product => {
      product.prices.localStores?.forEach(store => {
        stores.add(JSON.stringify({
          name: store.name,
          branch: store.branch
        }));
      });
    });

    // Insert stores
    const uniqueStores = Array.from(stores).map(store => JSON.parse(store));
    if (uniqueStores.length > 0) {
      await db.collection(COLLECTIONS.STORES).insertMany(uniqueStores);
      console.log(`Inserted ${uniqueStores.length} stores`);
    }

    // Process and insert products
    const processedProducts = processProducts(mockProducts);
    await db.collection(COLLECTIONS.PRODUCTS).insertMany(processedProducts);
    console.log(`Inserted ${mockProducts.length} products`);

    // Create price history records
    const priceHistory = mockProducts.flatMap(product => {
      const history = [];
      const now = new Date();

      // Add Amazon price history
      if (product.prices.amazon) {
        history.push({
          productId: product.id,
          source: 'amazon',
          price: product.prices.amazon.price,
          timestamp: product.prices.amazon.lastUpdated || now
        });
      }

      // Add Flipkart price history
      if (product.prices.flipkart) {
        history.push({
          productId: product.id,
          source: 'flipkart',
          price: product.prices.flipkart.price,
          timestamp: product.prices.flipkart.lastUpdated || now
        });
      }

      // Add local store price history
      product.prices.localStores?.forEach(store => {
        history.push({
          productId: product.id,
          source: 'local',
          storeName: store.name,
          storeBranch: store.branch,
          price: store.price,
          timestamp: store.lastUpdated || now
        });
      });

      return history;
    });

    if (priceHistory.length > 0) {
      await db.collection(COLLECTIONS.PRICE_HISTORY).insertMany(priceHistory);
      console.log(`Inserted ${priceHistory.length} price history records`);
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the migration
migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });