"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import BottomNavLumi from "./BottomNavLumi";
import { useTheme } from "@/context/ThemeProvider";
import HeaderCart from "./HeaderCart";
import { supabase } from '@/integrations/supabase/client';
import { Search, Menu, X, ShoppingCart, Heart, User, Package, Store, Truck, Bell, Percent, Grid3X3, Home, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useAuth } from "@/hooks/useAuth"; // Importar useAuth para verificar autenticação

interface AppLayoutProps {
  children: ReactNode;
}

const LOGO_URL = "https://kxvyveizgrnieetbttjx.supabase.co/storage/v1/object/public/Banners%20and%20Logos/logo/Logo%20Lumi.png";
const excludedPaths = ["/login", "/register"];

// Links de navegação principais
const mainNavLinks = [
  { label: "Início", href: "/home", icon: Home },
  { label: "Categorias", href: "/categories", icon: Grid3X3 },
  { label: "Ofertas", href: "/offers", icon: Percent },
];

// Links de utilidades (para o menu lateral)
const utilityLinks = [
  { label: "Meus Pedidos", href: "/orders", icon: Package },
  { label: "Favoritos", href: "/favorites", icon: Heart },
  { label: "Acompanhar Pedido", href: "/track-order", icon: Truck },
  { label: "Configurações", href: "/settings", icon: Settings },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth(); // Usando useAuth para estado de autenticação
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = excludedPaths.some(path => location.pathname.startsWith(path));
  
  // Define o caminho para a página de perfil/dashboard
  const profilePath = isAuthenticated ? "/account" : "/login";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    navigate('/home');
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out font-body ${
        theme === "dark"
          ? "bg-[#0a0a0a] text-white"
          : "bg-[#fafafa] text-gray-900"
      }`}
    >
      {/* Navbar Fixo (Desktop) / Hamburguer (Mobile) */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-800 px-4 md:px-8 py-3">
        <div className="flex items-center justify-between h-16">
          
          {/* Lado Esquerdo: Menu Mobile / Logo / Navegação Desktop */}
          <div className="flex items-center space-x-3">
            
            {/* Menu Hamburguer (Mobile Only) */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white dark:bg-gray-900">
                <SheetHeader>
                  <SheetTitle className="text-gray-900 dark:text-white">Menu Lumi</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-2">
                  {/* Links Principais */}
                  {mainNavLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                  
                  {/* Links de Utilidades */}
                  {utilityLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  
                  {/* Autenticação */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition-colors w-full text-left text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left text-gray-900 dark:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Entrar / Cadastrar</span>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2 lg:mr-6">
              <img src={LOGO_URL} alt="Lumi Logo" className="h-8 w-auto" />
            </Link>
            
            {/* Navegação Desktop (Aparece em telas grandes) */}
            <nav className="hidden lg:flex items-center space-x-6">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    location.pathname === link.href ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centro: Busca Centralizada (Visível em todas as telas) */}
          <div className="flex-1 max-w-xl mx-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const searchInput = e.currentTarget.querySelector('input');
              if (searchInput?.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchInput.value)}`);
              }
            }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar produtos, lojas ou marcas..."
                  className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                />
              </div>
            </form>
          </div>

          {/* Lado Direito: Utilitários e Auth */}
          <div className="flex items-center space-x-3">
            {/* Busca Mobile (REMOVIDA, pois a busca centralizada agora é visível) */}
            
            <HeaderCart />
            <ThemeToggle />
            
            {/* Botões de Auth Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (
                <Button asChild variant="ghost" size="sm">
                  <Link to={profilePath}>
                    <User className="h-5 w-5 mr-2" />
                    Conta
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="dark:border-gray-700 dark:hover:bg-gray-700">
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/register">Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pb-20">{children}</main>

      {/* BottomNavLumi (Mobile Only) */}
      <BottomNavLumi />
    </div>
  );
}