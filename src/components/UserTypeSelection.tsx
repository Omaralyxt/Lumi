"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserTypeSelection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(path);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Lumi</h1>
          <p className="text-gray-600 mt-2">Selecione como deseja continuar</p>
        </div>

        {/* User Type Selection */}
        <div className="space-y-6">
          {/* Buyer Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Comprador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                Acesse sua conta para comprar, gerenciar pedidos e favoritos.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => handleNavigate("/buyer/login")} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Carregando..." : "Entrar como Comprador"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigate("/buyer/register")} 
                  disabled={isLoading}
                  className="w-full"
                >
                  Criar Conta de Comprador
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Seller Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Store className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Vendedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                Gerencie sua loja, produtos e pedidos.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => handleNavigate("/seller/login")} 
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? "Carregando..." : "Entrar como Vendedor"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigate("/seller/register")} 
                  disabled={isLoading}
                  className="w-full"
                >
                  Criar Conta de Vendedor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link to="/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}