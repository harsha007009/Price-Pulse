import { Separator } from "@/components/ui/separator"
import { AccountSettings } from "@/components/account-settings"
import { NotificationSettings } from "@/components/notification-settings"
import { LocationSettings } from "@/components/location-settings"

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        <Separator />

        <div className="grid gap-10">
          <AccountSettings />
          <NotificationSettings />
          <LocationSettings />
        </div>
      </div>
    </main>
  )
}

