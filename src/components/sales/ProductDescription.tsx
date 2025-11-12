"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product as ProductType } from "@/types/product";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductDescriptionProps {
  product: ProductType;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  // Converte o objeto specifications em um array de pares chave-valor
  const specificationsArray = Object.entries(product.specifications || {}).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:border dark:border-gray-700">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {product.description || "Nenhuma descrição detalhada fornecida para este produto."}
          </p>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specificationsArray.length > 0 ? (
              specificationsArray.map(({ key, value }) => (
                <div key={key} className="border-b pb-3 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">{value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Nenhuma especificação técnica disponível.</p>
            )}
          </div>
        </TabsContent>
        
        {/* Conteúdo 'shop' removido conforme solicitado */}
      </Tabs>
    </div>
  );
}