"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Shield, Fingerprint, FaceId } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BiometricLogin from "./BiometricLogin";
import BiometricRegistration from "./BiometricRegistration";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem("lumi_token", data.token);
        localStorage.setItem("lumi_profile", JSON.stringify(data.profile));
        window.location.href = "/";
      } else {
        setError(data.error || "Falha no login");
      }
    } catch (err) {
      setError("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New User", // In a real app, this would come from a form
          email,
          password,
          phone: "+258000000000", // In a real app, this would come from a form
          user_type: "buyer"
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Conta criada com sucesso! Faça login para continuar.");
        setActiveTab("login");
      } else {
        setError(data.error || "Falha no registro");
      }
    } catch (err) {
      setError("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = () => {
    window.location.href = "/";
  };

  const handleBiometricError = (error: string) => {
    setError(error);
  };

  const handleFallback = () => {
    setActiveTab("login");
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
          <p className="text-gray-600 mt-2">Login / Register</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Entrar na sua conta</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Biometric Login Section */}
                <div className="mb-6">
                  <BiometricLogin 
                    onSuccess={handleBiometricSuccess}
                    onError={handleBiometricError}
                    onFallback={handleFallback}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Ou continue com</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 mt-6">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm text-gray-600">Lembrar de mim</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Não tem uma conta?{" "}
                    <button 
                      onClick={() => setActiveTab("register")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Cadastre-se
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="João Silva"
                        value="New User" // Simplified for demo
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Política de Privacidade
                    </a>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Já tem uma conta?{" "}
                    <button 
                      onClick={() => setActiveTab("login")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Entre aqui
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}