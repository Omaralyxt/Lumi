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
  
  console.log("ProductDescription received specifications:", product.specifications);
  console.log("Specifications Array for rendering:", specificationsArray);

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
          {specificationsArray.length > 0 ? (
            <div className="space-y-3">
              {specificationsArray.map(({ key, value }) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex-1">{String(key)}</span>
                  <span className="text-gray-900 dark:text-white font-semibold flex-1 text-right">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Sem nenhuma especificação do producto.
            </p>
          )}
        </TabsContent>
        
        {/* Conteúdo 'shop' removido conforme solicitado */}
      </Tabs>
    </div>
  );
}