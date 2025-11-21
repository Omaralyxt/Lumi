"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product as ProductType } from "@/types/product";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { ProductDetailedMedia } from "./ProductDetailedMedia"; // Removido, pois a mídia será renderizada inline

interface DetailedMediaItem {
  url: string;
  type: 'image' | 'video';
}

interface ProductDescriptionProps {
  product: ProductType;
}

// Componente auxiliar para renderizar uma única mídia detalhada (imagem ou vídeo)
const MediaRenderer = ({ item }: { item: DetailedMediaItem }) => {
  if (item.type === 'video') {
    return (
      <div className="my-6 w-full max-w-xl mx-auto border rounded-lg overflow-hidden dark:border-gray-700">
        <video controls className="w-full h-auto">
          <source src={item.url} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>
    );
  }
  
  // Default to image
  return (
    <div className="my-6 w-full max-w-xl mx-auto">
      <img 
        src={item.url} 
        alt="Detalhe do Produto" 
        className="w-full h-auto object-cover rounded-lg shadow-md" 
      />
    </div>
  );
};


export function ProductDescription({ product }: ProductDescriptionProps) {
  // Converte o objeto specifications em um array de pares chave-valor
  const specificationsArray = Object.entries(product.specifications || {}).map(([key, value]) => ({
    key,
    value,
  }));
  
  // Filtra e prepara a mídia detalhada
  const detailedMedia: DetailedMediaItem[] = (product.detailedImages || []).filter(item => item.url && item.type) as DetailedMediaItem[];

  const descriptionText = product.description || "Nenhuma descrição detalhada fornecida para este produto.";
  
  // Lógica para dividir o texto e intercalar a mídia
  let textPart1 = descriptionText;
  let textPart2 = '';
  
  const media1 = detailedMedia[0];
  const media2 = detailedMedia[1];
  const media3 = detailedMedia[2];
  
  // Se tivermos pelo menos 2 mídias, dividimos o texto em duas partes para inserir a mídia 2 no meio.
  if (media2 && descriptionText.length > 100) {
    const splitIndex = Math.floor(descriptionText.length / 2);
    textPart1 = descriptionText.substring(0, splitIndex);
    textPart2 = descriptionText.substring(splitIndex);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:border dark:border-gray-700">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          
          {/* 1. Primeira Imagem (se existir) */}
          {media1 && <MediaRenderer item={media1} />}

          {/* 2. Primeira Parte do Texto */}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-4">
            {textPart1}
          </p>
          
          {/* 3. Imagem do Meio (se existir) */}
          {media2 && <MediaRenderer item={media2} />}
          
          {/* 4. Segunda Parte do Texto (se existir) */}
          {textPart2 && (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-4">
              {textPart2}
            </p>
          )}

          {/* 5. Imagem Final (se existir) */}
          {media3 && <MediaRenderer item={media3} />}
          
          {/* Se houver mais mídias, elas não serão exibidas com este layout. */}
          
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
      </Tabs>
    </div>
  );
}