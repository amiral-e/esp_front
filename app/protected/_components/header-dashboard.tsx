import NavItem from "@/components/nav-item";
import React from "react";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/protected" },
  { title: "Chat", href: "/protected/chat" },
];

const HeaderDashboard = () => {
  return (
    <header className="flex justify-between p-4 border-b">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </header>
  );
};

export default HeaderDashboard;
