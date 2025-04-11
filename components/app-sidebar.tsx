"use client";

import {
  BotMessageSquare,
  Calendar,
  Home,
  Inbox,
  LibraryBig,
  Search,
  Settings,
  SquareTerminal,
  UserRoundCog,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { getCurrentUser } from "@/actions/auth.actions";
import React, { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    icon: <Home className="size-4" />,
    name: "Accueil",
    href: "/",
  },
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
];

export function AppSidebar() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  }>({
    name: "Chargement...",
    email: "chargement@example.com",
    avatar:
      "https://imgs.search.brave.com/M8vUaXuaKOoY5ieJEV0yRbVyx98IAIRuFZ8tdnsiykw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdGV1cnMtbGli/cmUvaG9tbWUtYWZm/YWlyZXMtY2FyYWN0/ZXJlLWF2YXRhci1p/c29sZV8yNDg3Ny02/MDExMS5qcGc_c2Vt/dD1haXNfaHlicmlk",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getCurrentUser();
        console.log("USER INFO", userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-md">Crédits</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={33} />
          </CardContent>
        </Card>

        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
