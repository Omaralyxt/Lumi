"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import BottomNavLumi from "./BottomNavLumi";
import { useTheme } from "@/context/ThemeProvider";
import HeaderCart from "./HeaderCart";
import { supabase } from '@/integrations/supabase/client';
import { Search, Menu, X, ShoppingCart, Heart, User, Package, Store, Truck, Bell, Percent, Grid3X3, Home, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

interface AppLayoutProps {
  children: ReactNode;
}

const LOGO_URL = "https://kxvyveizgrnieetbttjx.supabase.co/storage/v1/object/public/Banners%20and%20Logos/logo/Logo%20Lumi.png";
const excludedPaths = ["/login", "/register"];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = excludedPaths.some(path => location.pathname.startsWith(path));
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Redirecionar usuários logados de páginas de autenticação para /home
      if (user && isAuthPage) {
        navigate('/home');
      }
    };

    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      
      // Redirecionar após login/logout
      if (_event === 'SIGNED_IN') {
        navigate('/home');
      } else if (_event === 'SIGNED_OUT') {
        navigate('/home');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isAuthPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/home');
  };

  // Menu simplificado para utilidades e rotas secundárias
  const menuItems = [
    { icon: Package, label: "Meus Pedidos", href: "/orders" },
    { icon: Heart, label: "Favoritos", href: "/favorites" },
    { icon: Bell, label: "Notificações", href: "/notifications" },
    { icon: Truck, label: "Acompanhar Pedido", href: "/track-order" },
    { icon: Store, label: "Lojas Parceiras", href: "/stores" },
  ];

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
      {/* Navbar com Menu Hambúrguer, Logo e Busca Centralizada */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-800 px-4 md:px-8 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Menu Hambúrguer e Logo */}
          <div className="flex items-center space-x-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white dark:bg-gray-900">
                <SheetHeader>
                  <SheetTitle className="text-gray-900 dark:text-white">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-2">
                  {/* Itens principais (já na barra inferior, mas úteis no menu) */}
                  <Link
                    to="/home"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Início</span>
                  </Link>
                  <Link
                    to="/categories"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Grid3X3 className="h-5 w-5" />
                    <span>Categorias</span>
                  </Link>
                  <Link
                    to="/offers"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Percent className="h-5 w-5" />
                    <span>Ofertas</span>
                  </Link>
                  
                  {/* Itens Secundários */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                  
                  {menuItems.map((item) => (
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
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left text-gray-900 dark:text-white"
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
                      <span>Entrar</span>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo ao lado do menu hambúrguer */}
            <Link to="/home" className="flex items-center space-x-2">
              <img src={LOGO_URL} alt="Lumi Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Busca Centralizada */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const searchInput = e.currentTarget.querySelector('input');
              if (searchInput?.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchInput.value)}`);
              }
            }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos, lojas ou marcas..."
                  className="w-full pl-4 pr-4 py-2 text-gray-900 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                />
              </div>
            </form>
          </div>

          {/* Botões à direita */}
          <div className="flex items-center space-x-3">
            <HeaderCart />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pb-20">{children}</main>

      <BottomNavLumi />
    </div>
  );
}