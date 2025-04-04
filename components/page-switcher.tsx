"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Layout, LibraryBig, MessageSquare, SquareTerminal, UserRoundCog } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isAdministrator } from "@/app/actions";

const routes = [
  {
    icon: <Layout size={16} />,
    name: "Accueil",
    href: "/",
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
  {
    icon: <UserRoundCog className="size-4" />,
    name: "Profile",
    href: "/protected/profile/",
  },
  {
    icon: <SquareTerminal className="size-4" />,
    name: "Admin",
    href: "/protected/admin/",
    adminOnly: true,
  }
];

const PageSwitcher = () => {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  // Trouve la route correspondante en vérifiant si le pathname commence par la route.href
  const currentRoute = routes.find((route) =>
    pathname.startsWith(route.href.replace(/\/$/, ""))
  );

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await isAdministrator();
      setIsAdmin(result);
    };
    checkAdmin();
  }, []);

  const filteredRoutes = routes.filter((route) => !route.adminOnly || isAdmin)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            {currentRoute?.icon}
            <h3 className="text-sm font-semibold">{currentRoute?.name}</h3>
          </div>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-64">
        {filteredRoutes.map((route, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link href={route.href} className="flex items-center gap-2">
              {route.icon}
              <span>{route.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PageSwitcher;