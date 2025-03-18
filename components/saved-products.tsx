"use client"

import { useState } from "react"
import { safeLocalStorage, useClientSideEffect } from "@/lib/client-utils"

export function useSavedProducts() {
  const [savedProducts, setSavedProducts] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useClientSideEffect(() => {
    const saved = safeLocalStorage.getItem("savedProducts", [])
    setSavedProducts(saved)
    setIsLoaded(true)
  }, [])

  const toggleSavedProduct = (productId: string) => {
    let updatedProducts: string[]

    if (savedProducts.includes(productId)) {
      updatedProducts = savedProducts.filter((id) => id !== productId)
    } else {
      updatedProducts = [...savedProducts, productId]
    }

    setSavedProducts(updatedProducts)
    safeLocalStorage.setItem("savedProducts", updatedProducts)
    return updatedProducts
  }

  const isProductSaved = (productId: string) => {
    return savedProducts.includes(productId)
  }

  return {
    savedProducts,
    toggleSavedProduct,
    isProductSaved,
    isLoaded,
  }
}

