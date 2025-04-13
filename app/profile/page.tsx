import { UserProfilePage } from "@/components/user-profile-page"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "User Profile | Price Pulse",
  description: "Manage your account and tracked products",
}

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PageHeader 
        title="User Profile" 
        description="Manage your account and tracked products" 
      />
      <UserProfilePage />
    </main>
  )
}