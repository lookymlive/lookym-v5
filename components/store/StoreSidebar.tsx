import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/utils"
import { Button } from "@/components/atoms/Button"
import { Icons } from "@/components/ui/icons"

const menuItems = [
  {
    title: "Dashboard",
    href: "/store",
    icon: Icons.dashboard,
  },
  {
    title: "Products",
    href: "/store/products",
    icon: Icons.product,
  },
  {
    title: "Upload",
    href: "/store/upload",
    icon: Icons.upload,
  },
  {
    title: "Orders",
    href: "/store/orders",
    icon: Icons.order,
  },
  {
    title: "Analytics",
    href: "/store/analytics",
    icon: Icons.chart,
  },
  {
    title: "Settings",
    href: "/store/settings",
    icon: Icons.settings,
  },
]

export default function StoreSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 z-50 border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/store" className="flex items-center space-x-2">
          <Icons.store className="h-6 w-6" />
          <span className="font-bold">Store Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <Link href="/store/support">
          <Button variant="ghost" className="w-full justify-start">
            <Icons.help className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
        </Link>
      </div>
    </aside>
  )
}
