"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDown,
  Layout,
  LibraryBig,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";
import { Button } from "./ui/button";
const routes = [
  {
    icon: <Layout size={16} />,
    name: "Dashboard",
    href: "/protected/dashboard/",
  },
  {
    icon: <MessageSquare size={16} />,
    name: "Chat",
    href: "/protected/chat/",
  },
  {
    icon: <LibraryBig size={16} />,
    name: "Collections",
    href: "/protected/collections/",
  },
];

const PageSwitcher = () => {
  const pathname = usePathname();

  // Trouve la route correspondante en vérifiant si le pathname commence par la route.href
  const currentRoute = routes.find((route) =>
    pathname.startsWith(route.href.replace(/\/$/, ""))
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            {currentRoute?.icon}
            <h3 className="text-sm font-semibold">{currentRoute?.name}</h3>
          </div>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-64">
        {routes.map((route, index) => (
          <DropdownMenuItem key={index}>
            {route.icon}
            <Link href={route.href}>{route.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PageSwitcher;
