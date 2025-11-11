"use client";

import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, User, Heart, Settings, LogOut, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext as useAuth } from '@/context/AuthContext'; // Corrigido para usar useAuthContext
import Header from './Header';
import Footer from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { label: 'Início', href: '/home', icon: Home },
  { label: 'Meus Pedidos', href: '/order-history', icon: ListOrdered }, // Link para Histórico de Pedidos
  { label: 'Favoritos', href: '/favorites', icon: Heart },
  { label: 'Minha Conta', href: '/account', icon: User },
  { label: 'Configurações', href: '/settings', icon: Settings },
];

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // useAuth agora é useAuthContext
  const location = useLocation();

  // Ocultar layout em páginas de autenticação
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Função de logout (precisa ser implementada no AuthContext ou usar o supabase diretamente)
  // Como o AuthContext não expõe 'logout', vamos usar o supabase diretamente aqui por enquanto,
  // ou assumir que o useAuthContext deveria expor uma função de logout.
  // Vou adicionar uma função de logout simples que usa o supabase, já que o useAuthContext não a expõe.
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1 pt-16"> {/* pt-16 para compensar o Header fixo */}
        
        {/* Sidebar (Menu Lateral) - Visível em telas maiores */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="mt-6 pt-4 border-t dark:border-gray-800">
              <Button 
                onClick={handleSignOut} // Usando a função local
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-gray-800"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </Button>
            </div>
          )}
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AppLayout;