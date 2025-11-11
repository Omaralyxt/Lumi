import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Home, Package, Store, Bell, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { LOGO_URL } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: ('buyer' | 'seller' | 'administrator')[];
}

const navItems: NavItem[] = [
  { name: 'Início', href: '/home', icon: Home, roles: ['buyer'] },
  { name: 'Pedidos', href: '/orders', icon: Package, roles: ['buyer'] },
  { name: 'Minha Loja', href: '/seller/dashboard', icon: Store, roles: ['seller'] },
  { name: 'Admin', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['administrator'] },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut, isAuthenticated, isLoading } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const userRole = profile?.role || 'buyer';

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole as 'buyer' | 'seller' | 'administrator')
  );

  const isSeller = userRole === 'seller';
  const isAdmin = userRole === 'administrator';

  const handleSignOut = async () => {
    await signOut();
  };

  const renderAuthButtons = () => {
    if (isLoading) {
      return <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} alt={profile?.first_name || "User"} />
                <AvatarFallback>{profile?.first_name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Buyer Links */}
            {userRole === 'buyer' && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Meus Pedidos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            {/* Seller Links */}
            {isSeller && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/seller/dashboard">
                    <Store className="mr-2 h-4 w-4" />
                    <span>Dashboard da Loja</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/seller/products">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Meus Produtos</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex space-x-2">
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/register">Cadastrar</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 pt-6">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 p-2 rounded-md text-lg font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <Link to="/login" className="p-2 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsSheetOpen(false)}>
                        Entrar
                      </Link>
                      <Link to="/register" className="p-2 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsSheetOpen(false)}>
                        Cadastrar
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/home" className="flex items-center space-x-2">
              <img src={LOGO_URL} alt="Lumi Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions and Auth */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {renderAuthButtons()}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Lumi. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                Sobre
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                Contato
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;