"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem = ({ href, children }: NavItemProps) => {
  const pathname = usePathname();
  console.log(pathname);
  const isActive = pathname === href;

  return (
    <Button variant="link" asChild>
      <Link
        href={href}
        className={cn(
          "text-sm font-medium",
          isActive && "underline underline-offset-4 text-orange-600"
        )}
      >
        {children}
      </Link>
    </Button>
  );
};

export default NavItem;
