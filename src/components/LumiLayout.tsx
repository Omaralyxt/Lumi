"use client";

import React, { ReactNode } from "react";
import { useTheme, ThemeToggle } from "@/context/ThemeContext";
import BottomNavLumi from "./BottomNavLumi";
import CompareBar from "./CompareBar";
import { Link } from "react-router-dom";

interface LumiLayoutProps {
  children: ReactNode;
}

export default function LumiLayout({ children }: LumiLayoutProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out font-body ${
        theme === "dark"
          ? "bg-[#0a0a0a] text-white"
          : "bg-[#fafafa] text-gray-900"
      }`}
    >
      {/* Navbar com tema switch */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 border-b border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <Link to="/">
          <h1 className="text-3xl font-title font-bold tracking-wider text-blue-600 dark:text-white">
            Lumi
          </h1>
        </Link>

        <ThemeToggle />
      </header>

      {/* Conteúdo principal */}
      <main className="p-0">{children}</main>

      <BottomNavLumi />
      <CompareBar />
    </div>
  );
}