"use client";

import NavigationMenuBar from "@/components/navigationMenuBar";
import { usePathname } from "next/navigation";

export default function NavigationMenuWrapper() {
  const pathname = usePathname();
  if (pathname !== "/protected/chat") {
    console.log("Not rendering navigation menu bar");
    return null;
  } 
  console.log("Rendering navigation menu bar");

  return <NavigationMenuBar />;
}
