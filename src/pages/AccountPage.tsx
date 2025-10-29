"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, CreditCard, ShoppingBag, Heart, Gift, Settings, LogOut } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AccountCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const AccountCard: React.FC<AccountCardProps> = ({ to, title, description, icon: Icon }) => (
  <Link to={to} className="block">
    <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-title text-xl text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function AccountPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Mocked data for credits and coupons since tables don't exist
  const [couponsCount] = useState(3);
  const [creditsAmount] = useState(1500);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    // Should be handled by AppLayout, but good fallback
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-body">
      <h1 className="font-title text-4xl mb-6 text-gray-900 dark:text-white">Minha Conta</h1>

      {/* Cards principais */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AccountCard 
          to="/profile" 
          title="Detalhes Pessoais" 
          description="Editar nome, email e senha" 
          icon={User} 
        />

        <AccountCard 
          to="/addresses" 
          title="Endereços" 
          description="Gerenciar endereços de entrega" 
          icon={MapPin} 
        />

        <AccountCard 
          to="/payments" 
          title="Métodos de Pagamento" 
          description="Cartões e carteiras digitais" 
          icon={CreditCard} 
        />

        <AccountCard 
          to="/orders" 
          title="Histórico de Pedidos" 
          description="Ver detalhes e status dos pedidos" 
          icon={ShoppingBag} 
        />

        <AccountCard 
          to="/favorites" 
          title="Favoritos" 
          description="Produtos salvos" 
          icon={Heart} 
        />

        <AccountCard 
          to="/coupons" 
          title="Cupons e Créditos" 
          description={`${couponsCount} cupons ativos | Crédito: ${creditsAmount.toLocaleString('pt-MZ')} MZN`} 
          icon={Gift} 
        />

        <AccountCard 
          to="/settings" 
          title="Configurações" 
          description="Tema, notificações e suporte" 
          icon={Settings} 
        />
      </div>

      <Button 
        onClick={handleSignOut} 
        variant="destructive" 
        className="mt-8 w-full md:w-auto"
      >
        <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
      </Button>
    </div>
  );
}