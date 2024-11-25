import { Metadata } from "next"
import StoreSidebar from "@/components/store/StoreSidebar"
import { StoreHeader } from "@/components/store/StoreHeader"

export const metadata: Metadata = {
  title: "Store Dashboard | Lookym",
  description: "Manage your store and products on Lookym",
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1">
        <StoreHeader />
        <main className="flex-1 p-6 bg-gray-50/50">{children}</main>
      </div>
    </div>
  )
}
