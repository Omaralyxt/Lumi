"use client";

import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Grid3X3, 
  Store, // Usar Store para Lojas
  User, 
  Heart 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const navItems = [
  { path: "/home", icon: Home, label: "Início" },
  { path: "/categories", icon: Grid3X3, label: "Categorias" },
  { path: "/offers", icon: Store, label: "Ofertas" }, // Reutilizando Store para Ofertas
  { path: "/favorites", icon: Heart, label: "Favoritos" },
  { path: "/account", icon: User, label: "Conta" },
];

export default function BottomNavLumi() {
  const location = useLocation();
  const { cartCount } = useCart(); // Usar cartCount do contexto
  const { favorites } = useFavorites();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          // Contagem de itens para carrinho e favoritos
          let badgeCount = 0;
          if (item.path === "/cart") {
            badgeCount = cartCount;
          } else if (item.path === "/favorites") {
            badgeCount = favorites.length;
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full w-full transition-colors ${
                isActive 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${
                isActive 
                  ? "text-blue-600 dark:text-blue-400 font-medium" 
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}