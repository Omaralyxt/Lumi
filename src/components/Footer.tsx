"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto pt-10 pb-20 sm:pb-10 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
          
          {/* Coluna 1: Sobre Lumi */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-title text-blue-400">Lumi Marketplace</h3>
            <p className="text-sm text-gray-400">
              O seu destino online para produtos de qualidade em Moçambique. Conectando compradores e vendedores locais.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-title">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/home" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Categorias</Link></li>
              <li><Link to="/offers" className="text-gray-400 hover:text-white transition-colors">Ofertas</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white transition-colors">Rastrear Pedido</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Minha Conta */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-title">Conta</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="text-gray-400 hover:text-white transition-colors">Minha Conta</Link></li>
              <li><Link to="/order-history" className="text-gray-400 hover:text-white transition-colors">Meus Pedidos</Link></li>
              <li><Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">Favoritos</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login / Cadastro</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-title">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-400">Maputo, Moçambique</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <a href="mailto:suporte@lumi.co.mz" className="text-gray-400 hover:text-white transition-colors">suporte@lumi.co.mz</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <a href="tel:+258840000000" className="text-gray-400 hover:text-white transition-colors">+258 84 000 0000</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Direitos Autorais */}
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Lumi Marketplace. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}