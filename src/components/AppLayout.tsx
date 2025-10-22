"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import BottomNavLumi from "./BottomNavLumi";
import { useTheme } from "@/context/ThemeProvider";
import HeaderCart from "./HeaderCart";
import logo from "@/assets/images/logo.svg";
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: ReactNode;
}

const excludedPaths = ["/seller/login", "/seller/register", "/buyer/login", "/buyer/register"];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);

  const isAuthPage = excludedPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Redirecionar usuários logados de páginas de autenticação
      if (user && isAuthPage) {
        const profile = user.user_metadata;
        if (profile?.user_type === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      }
    };

    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      
      // Redirecionar após login/logout
      if (_event === 'SIGNED_IN') {
        const profile = session?.user?.user_metadata;
        if (profile?.user_type === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      } else if (_event === 'SIGNED_OUT') {
        navigate('/');
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
      {/* Navbar com tema switch e carrinho */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-800 px-4 md:px-8 py-3 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="Lumi Logo" className="h-10 w-auto" />
        </Link>

        <div className="flex items-center space-x-3">
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