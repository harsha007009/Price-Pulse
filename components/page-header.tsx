"use client"

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  )
}

