"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Grid3X3, Percent } from "lucide-react"; // Usando Percent para Ofertas
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications"; // Mantido para o badge de notificação, mas o item de navegação será removido

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  badgeCount?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive, badgeCount = 0 }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center p-1 transition-colors ${
      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
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
    <span className="text-xs mt-0.5">{label}</span>
  </Link>
);

export default function BottomNavLumi() {
  const location = useLocation();
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  // const { unreadCount } = useNotifications(); // Removido o uso direto, mas mantido o hook

  // O cartCount não é mais necessário aqui, mas mantemos a importação do useCart por segurança
  // const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isSeller = useAuth().user?.role === 'seller';
  
  // Define o caminho para a página de perfil/dashboard
  const profilePath = isAuthenticated ? (isSeller ? "/seller/dashboard" : "/account") : "/login";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around h-14">
        <NavItem
          to="/home"
          icon={Home}
          label="Início"
          isActive={location.pathname === "/home" || location.pathname === "/"}
        />
        <NavItem
          to="/categories"
          icon={Grid3X3}
          label="Categorias"
          isActive={location.pathname.startsWith("/categories") || location.pathname.startsWith("/category/")}
        />
        <NavItem
          to="/offers"
          icon={Percent} // Usando Percent para Ofertas
          label="Ofertas"
          isActive={location.pathname === "/offers"}
        />
        {/* Removido o item Cesto/Carrinho */}
        <NavItem
          to={profilePath}
          icon={User}
          label="Conta"
          isActive={location.pathname.startsWith("/account") || location.pathname.startsWith("/profile") || location.pathname.startsWith("/login")}
        />
      </div>
    </div>
  );
}