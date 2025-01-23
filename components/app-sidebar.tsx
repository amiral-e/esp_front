"use client";

import * as React from "react";
import {
  BotMessageSquare,
  Frame,
  GalleryVerticalEnd,
  LibraryBig,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getUserInfo, isAdministrator } from "@/app/actions";
import { NavUser } from "./nav-user";
import { use } from "chai";

const data = {
  teams: [
    {
      name: "ComptaCompanion",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Collection",
      url: "/protected/collections",
      icon: LibraryBig,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/protected/collections",
        }
      ],
    },
    
  ],
  admin: [
    {
      title: "Admin",
      url: "/protected/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "User List",
          url: "/protected/admin",
        }
      ],
    },
    
  ],
  chat: [
    {
      title: "Chat IA",
      url: "/protected/chat",
      icon: BotMessageSquare,
      isActive: true,
      items: [
        {
          title: "Chat Page",
          url: "/protected/chat",
        }
      ],
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ name: string; email: string; avatar: string } | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();
      setUser({
        name: "User",
        email: user?.email ?? "unknown@example.com",
        avatar: "https://imgs.search.brave.com/M8vUaXuaKOoY5ieJEV0yRbVyx98IAIRuFZ8tdnsiykw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdGV1cnMtbGli/cmUvaG9tbWUtYWZm/YWlyZXMtY2FyYWN0/ZXJlLWF2YXRhci1p/c29sZV8yNDg3Ny02/MDExMS5qcGc_c2Vt/dD1haXNfaHlicmlk",
      });
    };
    fetchUser();
    const fetchAdmin = async () => {
      const admin = await isAdministrator();
      setIsAdmin(admin);
    };

    fetchAdmin();
  }, []);

  if (!user) {
    return <div></div>;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.chat} />
        <NavMain items={data.navMain} />
        {isAdmin && <NavMain items={data.admin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
