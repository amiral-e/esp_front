"use client";

import NavigationMenuBar from "@/components/navigationMenuBar";
import { usePathname } from "next/navigation";

export default function NavigationMenuWrapper() {
  // const pathname = usePathname();
  // if (pathname !== "/protected/chat") {
  //   return null;
  // }

  return <NavigationMenuBar />;
}
