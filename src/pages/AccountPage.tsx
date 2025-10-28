"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Star, 
  Truck,
  Settings,
  Edit,
  LogOut,
  Shield,
  Moon,
  Sun,
  Palette,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BiometricRegistration from "@/components/BiometricRegistration";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'buyer' | 'seller' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setUserType(user.user_metadata?.user_type || null);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserType(null);
      }
    };

    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);
        setUserType(session.user.user_metadata?.user_type || null);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserType(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair. Tente novamente.");
      console.error("Erro ao sair:", error);
    } else {
      toast.success("Você saiu com sucesso.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Minha Conta</h1>
            <p className="text-gray-600 mb-8">Faça login para acessar sua conta</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Minha Conta</h1>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Lateral */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Link to="/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ShoppingBag className="h-5 w-5" />
                <span>Meus Pedidos</span>
              </Link>
              <Link to="/categories" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Grid3X3 className="h-5 w-5" />
                <span>Categorias</span>
              </Link>
              <Link to="/favorites" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Heart className="h-5 w-5" />
                <span>Favoritos</span>
              </Link>
              <Link to="/track-order" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Truck className="h-5 w-5" />
                <span>Acompanhar Pedido</span>
              </Link>
              <Link to="/stores" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Store className="h-5 w-5" />
                <span>Lojas Parceiras</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <User className="h-5 w-5" />
                <span>Perfil</span>
              </Link>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800 dark:text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.user_metadata?.full_name || user?.email}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">
                  Comprador
                </Badge>
                <span className="text-sm text-gray-500">
                  Membro desde {new Date(user?.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">Meus Pedidos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe seus pedidos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/favorites">
            <Card className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">Favoritos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Veja seus produtos salvos</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">Perfil</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Edite suas informações</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Configurações</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ajustes de conta</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurações de Aparência */}
        <div className="mt-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <Palette className="h-5 w-5 mr-2" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-gray-700 dark:text-gray-300">Alternar entre tema claro e escuro.</p>
              <ThemeToggle />
            </CardContent>
          </Card>
        </div>

        {/* Segurança da Conta */}
        <div className="mt-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <Shield className="h-5 w-5 mr-2" />
                Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BiometricRegistration userId={user?.id} email={user?.email} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}