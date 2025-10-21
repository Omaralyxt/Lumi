"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserTypeSelection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/buyer/login";
    }, 300);
  };

  const handleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/buyer/register";
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
          <p className="text-gray-600 mt-2">Encontre produtos incríveis em Moçambique</p>
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
                Compre produtos de milhares de lojas em todo o país com segurança e praticidade.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleLogin} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Carregando..." : "Entrar como Comprador"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRegister} 
                  disabled={isLoading}
                  className="w-full"
                >
                  Criar Conta de Comprador
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}