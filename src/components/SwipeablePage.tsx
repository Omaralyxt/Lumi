"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SwipeablePageProps {
  children: React.ReactNode;
  currentPage: string;
}

const pages = [
  { id: "home", path: "/home", label: "Home" },
  { id: "categories", path: "/categories", label: "Categorias" },
  { id: "stores", path: "/stores", label: "Lojas" }, // Adicionado 'stores'
  { id: "offers", path: "/offers", label: "Ofertas" },
  { id: "favorites", path: "/favorites", label: "Favoritos" },
  { id: "account", path: "/account", label: "Conta" },
];

export default function SwipeablePage({ children, currentPage }: SwipeablePageProps) {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  // Função para detectar toque
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    // Encontrar o índice da página atual
    const currentIndex = pages.findIndex(page => page.id === currentPage);
    
    if (isLeftSwipe && currentIndex < pages.length - 1) {
      // Swipe para a esquerda - ir para a próxima página
      const nextPage = pages[currentIndex + 1];
      navigate(nextPage.path);
    } else if (isRightSwipe && currentIndex > 0) {
      // Swipe para a direita - ir para a página anterior
      const prevPage = pages[currentIndex - 1];
      navigate(prevPage.path);
    }
    
    // Reset touch positions
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div 
      ref={pageRef}
      className="w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}