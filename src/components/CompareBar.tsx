"use client";

import { useCompare } from "@/context/CompareContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Layers } from "lucide-react";

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50 px-4">
      <div className="bg-white rounded-lg shadow-2xl p-4 flex items-center justify-between border">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-lg">Comparar Produtos ({compareItems.length}/4)</h3>
          <div className="flex items-center gap-2">
            {compareItems.map(item => (
              <div key={item.id} className="relative">
                <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded-md object-cover" />
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={clearCompare}>Limpar</Button>
          <Button asChild disabled={compareItems.length < 2}>
            <Link to="/compare">
              <Layers className="h-4 w-4 mr-2" />
              Comparar Agora
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}