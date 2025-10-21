"use client";

import { useCompare } from "@/context/CompareContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Check } from "lucide-react";

interface CompareButtonProps {
  product: Product;
  className?: string;
}

export default function CompareButton({ product, className }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isComparing = isInCompare(product.id);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação ao clicar no botão dentro de um Link
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <Button
      variant={isComparing ? "default" : "outline"}
      size="sm"
      onClick={handleToggleCompare}
      className={`transition-all ${className}`}
    >
      {isComparing ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Comparando
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Comparar
        </>
      )}
    </Button>
  );
}