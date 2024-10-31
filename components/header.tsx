import React from "react";
import NavItem from "./nav-item";
import Logo from "./ui/logo";
import HeaderAuth from "./header-auth";
const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/prix", label: "Prix" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  return (
    <div className="flex justify-between items-center top-0 py-6 border-b border-border mx-16">
      <Logo />
      <nav className="flex gap-4">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href}>
            {item.label}
          </NavItem>
        ))}
      </nav>
      <HeaderAuth />
    </div>
  );
};

export default Header;
