"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, User, Bell, Grid3X3 } from 'lucide-react';

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
    className={`flex flex-col items-center justify-center p-1 transition-colors relative ${
      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
    }`}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs mt-1 truncate max-w-[60px]">{label}</span>
    {badgeCount > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {badgeCount}
      </span>
    )}
  </Link>
);

const BottomNavLumi: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Definição dos itens de navegação
  const navItems = [
    { to: "/", icon: Home, label: "Início" },
    // O item de navegação para /fixed-pages (Grid3X3) foi removido
    { to: "/cart", icon: ShoppingCart, label: "Carrinho", badgeCount: 0 },
    { to: "/notifications", icon: Bell, label: "Notificações", badgeCount: 0 },
    { to: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="max-w-md mx-auto h-16 flex justify-around items-center">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.to}
            badgeCount={item.badgeCount}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavLumi;