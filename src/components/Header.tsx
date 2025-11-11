"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import HeaderCart from './HeaderCart';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const profilePath = isAuthenticated ? "/account" : "/login";
  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Home Link */}
        <Link to="/home" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg font-title">L</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white font-title hidden sm:block">Lumi</h1>
        </Link>

        {/* Search Bar (Desktop/Tablet) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="flex w-full">
            <Input
              type="search"
              placeholder="Buscar produtos, lojas..."
              className="rounded-r-none focus-visible:ring-0 dark:bg-gray-800 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none bg-blue-600 hover:bg-blue-700">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          
          {/* Search Icon (Mobile) */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => navigate('/search')}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Cart Icon */}
          <HeaderCart />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User/Profile Icon */}
          <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
            <Link to={profilePath}>
              {isAuthenticated ? (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-sm">{userInitial}</AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>
          </Button>
          
          {/* Menu Icon (Mobile - for AppLayout sidebar) */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}