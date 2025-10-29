import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth'; // Corrigido o caminho de importação
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // O hook useAuth não expõe 'signOut' diretamente, mas o AppLayout já lida com o estado de auth.
  // Para manter a funcionalidade de logout, vamos usar o supabase client diretamente aqui,
  // ou garantir que o useAuth forneça a função de logout.
  
  // Como o useAuth atual não expõe signOut, vamos importá-lo do supabase client.
  // No entanto, o useAuth atualizado em src/hooks/useAuth.tsx não tem a função signOut.
  // Vou atualizar o useAuth para incluir a função de logout.
  
  // Revertendo para a estrutura original do useAuth para evitar quebrar o hook.
  // Vou usar o supabase client diretamente para o logout, como feito em AppLayout.
  
  const handleSignOut = async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.signOut();
    navigate('/');
  };

  const currentPath = location.pathname.split('/').pop() || 'profile';

  const handleTabChange = (value: string) => {
    navigate(`/account/${value}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Tabs Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <Tabs value={currentPath} onValueChange={handleTabChange} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" onClick={handleSignOut} className="w-full md:w-auto">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>

        {/* Content Area (Outlet) */}
        <div className="py-6">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AccountPage;