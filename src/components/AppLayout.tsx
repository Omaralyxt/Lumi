"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import BottomNavLumi from "./BottomNavLumi";
import { useTheme } from "@/context/ThemeProvider";
import HeaderCart from "./HeaderCart";
import { supabase } from '@/integrations/supabase/client';
import { Search } from "lucide-react";
import { Button } from "./ui/button";

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
      {/* Navbar Minimalista (Visível em todas as páginas, exceto auth) */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-800 px-4 md:px-8 py-3 flex justify-between items-center h-16">
        {/* Espaço vazio para manter o alinhamento, ou você pode adicionar um ícone de menu aqui se necessário */}
        <div className="w-8 md:w-10"></div> 

        <div className="flex items-center space-x-3">
          {/* Se não for a Home, mostramos a busca aqui */}
          {!isHomePage && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
              <Search className="h-5 w-5" />
            </Button>
          )}
          <HeaderCart />
          <ThemeToggle />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pb-20">{children}</main>

      <BottomNavLumi />
    </div>
  );
}