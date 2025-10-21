"use client";

import { useCompare } from "@/context/CompareContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, CheckCircle, XCircle } from "lucide-react";

export default function ComparePage() {
  const { compareItems, clearCompare } = useCompare();

  if (compareItems.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <h1 className="text-2xl font-bold mb-4">Comparar Produtos</h1>
        <p className="text-gray-600 mb-6">Adicione pelo menos 2 produtos para comparar suas características.</p>
        <Button asChild>
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    );
  }

  // Coletar todas as chaves de especificações
  const allSpecKeys = Array.from(
    new Set(compareItems.flatMap(item => Object.keys(item.specifications)))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold font-title">Comparação de Produtos</h1>
          <Button variant="outline" onClick={clearCompare}>Limpar Tudo</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 w-1/5"></th>
                {compareItems.map(item => (
                  <th key={item.id} className="p-4 border-b-2">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.images[0]} alt={item.title} className="w-32 h-32 object-cover rounded-lg mx-auto mb-2" />
                      <h3 className="font-semibold text-blue-600 hover:underline">{item.title}</h3>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Preço */}
              <tr className="bg-white">
                <td className="p-4 font-semibold border-b">Preço</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-4 text-center border-b">
                    <p className="text-lg font-bold text-blue-600">MT {item.price.toLocaleString('pt-MZ')}</p>
                    {item.originalPrice && <p className="text-sm text-gray-500 line-through">MT {item.originalPrice.toLocaleString('pt-MZ')}</p>}
                  </td>
                ))}
              </tr>
              {/* Avaliação */}
              <tr className="bg-gray-50">
                <td className="p-4 font-semibold border-b">Avaliação</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-4 text-center border-b">
                    <div className="flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span>{item.rating.toFixed(1)} ({item.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
              {/* Especificações */}
              {allSpecKeys.map(key => (
                <tr key={key} className="even:bg-white odd:bg-gray-50">
                  <td className="p-4 font-semibold border-b">{key}</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 text-center border-b">
                      {item.specifications[key] || <span className="text-gray-400">-</span>}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Ações */}
              <tr className="bg-white">
                <td className="p-4 font-semibold"></td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-4 text-center">
                    <Button asChild>
                      <Link to={`/product/${item.id}`}>Ver Produto</Link>
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}