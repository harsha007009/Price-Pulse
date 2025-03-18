import { PriceAlerts } from "@/components/price-alerts"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Price Alerts | Price Tracker",
  description: "Manage your price alerts and get notified when prices drop",
}

export default function AlertsPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Price Alerts" description="Get notified when prices drop below your target" />
      <PriceAlerts className="max-w-4xl mx-auto" />
    </div>
  )
}

