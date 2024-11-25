import Link from "next/link"
import { auth } from "@/auth"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/atoms/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
import { MobileNav } from "@/components/store/MobileNav"

export async function StoreHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-14 items-center">
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Icons.search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon">
                <Icons.search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Icons.notification className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.avatar || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/store/settings">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/store/support">
                    <Icons.help className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={() => signOut()}
                >
                  <Icons.logout className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
