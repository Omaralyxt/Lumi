"use client";

import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import BottomNavLumi from "./BottomNavLumi";
import { useTheme } from "@/context/ThemeProvider";
import HeaderCart from "./HeaderCart"; // Importando HeaderCart
import logo from "@/assets/images/logo.svg"; // Importando a imagem do logo

interface AppLayoutProps {
  children: ReactNode;
}

const excludedPaths = ["/seller/login", "/seller/register", "/buyer/login", "/buyer/register"];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();

  const isAuthPage = excludedPaths.some(path => location.pathname.startsWith(path));

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
          {/* Usando a imagem do logo */}
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