"use client";

import { useState } from "react";
import { Home, Package, ShoppingCart, User, Store, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Importar as páginas
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import Checkout from "./Checkout";
import SellerDashboard from "./SellerDashboard";
import Login from "./Login";
import CreateProduct from "./CreateProduct";
import AdminDashboard from "./AdminDashboard";
import Profile from "./Profile";

type Page = "home" | "product" | "checkout" | "seller" | "login" | "create" | "admin" | "profile";

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"buyer" | "seller" | "admin" | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "product":
        return <ProductDetail />;
      case "checkout":
        return <Checkout />;
      case "seller":
        return <SellerDashboard />;
      case "login":
        return <Login onLogin={(role) => {
          setIsLoggedIn(true);
          setUserRole(role);
          setCurrentPage("home");
        }} />;
      case "create":
        return <CreateProduct />;
      case "admin":
        return <AdminDashboard />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  const handleLogin = (role: "buyer" | "seller" | "admin") => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage("login");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Lumi</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <Button
                variant={currentPage === "home" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("home")}
              >
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>

              {userRole === "buyer" && (
                <>
                  <Button
                    variant={currentPage === "product" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentPage("product")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Produtos
                  </Button>
                  <Button
                    variant={currentPage === "checkout" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentPage("checkout")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Carrinho
                  </Button>
                </>
              )}

              {userRole === "seller" && (
                <>
                  <Button
                    variant={currentPage === "seller" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentPage("seller")}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Minha Loja
                  </Button>
                  <Button
                    variant={currentPage === "create" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentPage("create")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Criar Produto
                  </Button>
                </>
              )}

              {userRole === "admin" && (
                <Button
                  variant={currentPage === "admin" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentPage("admin")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              )}

              <Button
                variant={currentPage === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Usuário</p>
                  <Badge variant="secondary" className="text-xs">
                    {userRole === "buyer" ? "Comprador" : userRole === "seller" ? "Vendedor" : "Admin"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}