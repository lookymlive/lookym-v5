import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/atoms/Button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

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

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Icons.store className="h-6 w-6" />
            <span>Store Dashboard</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-1 py-4">
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
      </SheetContent>
    </Sheet>
  )
}
