"use client";

import { Home, Search, Heart, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    id: "home",
    icon: Home,
    label: "Home",
    path: "/home",
  },
  {
    id: "categories",
    icon: Search,
    label: "Categorias",
    path: "/categories",
  },
  {
    id: "offers",
    icon: Package,
    label: "Ofertas",
    path: "/offers",
  },
  {
    id: "favorites",
    icon: Heart,
    label: "Favoritos",
    path: "/favorites",
  },
  {
    id: "account",
    icon: User,
    label: "Conta",
    path: "/account",
  },
];

export default function BottomNavLumi() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Ocultar em telas específicas
  const hideOnPages = ["/login", "/register", "/checkout", "/user-type"];
  const shouldHide = hideOnPages.some(page => location.pathname.startsWith(page));

  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-16 w-16 px-2 py-1 ${
                active ? "text-blue-600" : "text-gray-500"
              }`}
              onClick={() => handleNavigate(item.path)}
            >
              <Icon className={`h-5 w-5 mb-1 ${active ? "text-blue-600" : "text-gray-500"}`} />
              <span className={`text-xs ${active ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}