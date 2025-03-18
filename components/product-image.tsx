"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function ProductImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  fallbackSrc = "/placeholder.svg",
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [error, setError] = useState<boolean>(false)

  // Handle image load error
  const handleError = () => {
    // If already using fallback, show error state
    if (imgSrc === fallbackSrc) {
      setError(true)
      return
    }

    // Otherwise, try fallback image
    setImgSrc(fallbackSrc)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`}>
        <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
          <ImageOff className="h-10 w-10 mb-2" />
          <p className="text-sm text-center">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={true}
    />
  )
}

