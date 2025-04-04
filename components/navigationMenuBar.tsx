"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuBar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/protected/collections" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Collections</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/protected/chat" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Chat</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {isAdmin && (
          <NavigationMenuItem>
            <Link href="/protected/admin" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Admin</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <Link href="/protected/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Payment</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}