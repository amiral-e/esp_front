"use client"

import * as React from "react"
import {
  BotMessageSquare,
  GalleryVerticalEnd,
  LibraryBig,
  SquareTerminal,
  UserRoundCog,
  ChevronDown,
  Search,
} from "lucide-react"
import { getUserInfo, isAdministrator } from "@/app/actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { NavUser } from "./nav-user"

const routes = [
  {
    icon: <LibraryBig className="size-4" />,
    name: "Collections",
    href: "/protected/collections/",
  },
  {
    icon: <BotMessageSquare className="size-4" />,
    name: "Chat",
    href: "/protected/chat/",
  },
  {
    icon: <SquareTerminal className="size-4" />,
    name: "Admin",
    href: "/protected/admin/",
    adminOnly: true,
  },
  {
    icon: <UserRoundCog className="size-4" />,
    name: "Profile",
    href: "/protected/profile/",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar: string
  } | null>(null)
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo()
      setUser({
        name: "User",
        email: user?.email ?? "unknown@example.com",
        avatar:
          "https://imgs.search.brave.com/M8vUaXuaKOoY5ieJEV0yRbVyx98IAIRuFZ8tdnsiykw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdGV1cnMtbGli/cmUvaG9tbWUtYWZm/YWlyZXMtY2FyYWN0/ZXJlLWF2YXRhci1p/c29sZV8yNDg3Ny02/MDExMS5qcGc_c2Vt/dD1haXNfaHlicmlk",
      })
    }
    fetchUser()

    const fetchAdmin = async () => {
      const admin = await isAdministrator()
      setIsAdmin(admin)
    }
    fetchAdmin()
  }, [])

  if (!user) {
    return null
  }

  const filteredRoutes = routes.filter((route) => !route.adminOnly || isAdmin)

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">ComptaCompanion</span>
                    <span className="text-xs text-muted-foreground">Application</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                <DropdownMenuItem>
                  <span>ComptaCompanion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup className="py-2">
          <SidebarGroupContent className="relative">
            {/* Hide search input when sidebar is collapsed */}
            {!isCollapsed && (
              <>
                <SidebarInput placeholder="Search..." className="pl-8" />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map((route) => {
                const isActive = pathname.startsWith(route.href.replace(/\/$/, ""))
                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={route.name}>
                      <Link href={route.href} className="flex items-center gap-2">
                        {route.icon}
                        <span>{route.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
          <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

