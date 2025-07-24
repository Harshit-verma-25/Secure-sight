"use client";

import {
  Cctv,
  LayoutDashboardIcon,
  Settings,
  TriangleAlert,
  User,
  Users,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navbar = [
    {
      name: "Dashboard",
      icon: <LayoutDashboardIcon color="#FFCC00" fill="#FFCC00" height={20} />,
      href: "/",
    },
    {
      name: "Cameras",
      icon: <Cctv fill="#FFF" height={20} />,
      href: "/cameras",
    },
    { name: "Scenes", icon: <Settings height={20} />, href: "/scenes" },
    {
      name: "Incidents",
      icon: <TriangleAlert height={20} />,
      href: "/incidents",
    },
    { name: "Users", icon: <Users fill="#FFF" height={20} />, href: "/users" },
  ];

  return (
    <header className="w-full bg-[#0a0a0a]">
      <div className="flex items-center justify-between py-3 px-6">
        {/* Logo */}
        <Image src="/Logo.svg" alt="Logo" width={100} height={100} priority />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navbar.map((item) => (
            <Link href={item.href} key={item.name} className="flex items-center gap-1 text-white hover:text-yellow-400">
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Info (Hidden on small) */}
        <div className="hidden md:flex items-center space-x-2">
          <User className="text-white border border-white rounded-full h-8 w-8" />
          <div className="flex flex-col text-sm">
            <span className="text-white">Username</span>
            <span className="text-gray-400">user@example.com</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col space-y-4 p-4">
          {navbar.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              className="flex items-center gap-2 text-white hover:text-yellow-400"
              onClick={() => setIsOpen(false)}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Mobile user info */}
          <div className="flex items-center gap-2 mt-4">
            <User className="text-white border border-white rounded-full h-8 w-8" />
            <div className="flex flex-col text-sm">
              <span className="text-white">Username</span>
              <span className="text-gray-400">user@example.com</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
