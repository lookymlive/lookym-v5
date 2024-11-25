  "use client";
  import { FC, useState } from "react";
import {
  Navbar as NextUINav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { User, LogOut, Settings } from "lucide-react";

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <NextUINav
      shouldHideOnScroll
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            Lookym App
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            Lookym App
          </Link>
        </NavbarBrand>
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
              href={item.href}
             
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={session.user.name}
                size="sm"
                src={session.user.avatar || undefined}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="user-info" className="h-14 gap-2" textValue={`${session.user.email} - Signed in as`}>
                <p className="font-semibold">{session.user.email}</p>
              </DropdownItem>
              <DropdownItem key="edit-profile" startContent={<Settings size={20} />} textValue="Edit Profile">
                <Link href="/edit-profile">Edit Profile</Link>
              </DropdownItem>
              <DropdownItem key="view-profile" startContent={<User size={20} />} textValue="My Profile">
                <Link href="/profile">My Profile</Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<LogOut size={20} />} textValue="Log Out">
                <button onClick={handleSignOut}>Log Out</button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/sign-in">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/sign-up" variant="flat" >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`} >
            <span data-testid="text-value">{item.name}</span>
            <Link
              className="w-full text-foreground"
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINav>
  );
};

export default Navbar;