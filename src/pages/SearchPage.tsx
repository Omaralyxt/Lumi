"use client";

import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdvancedSearch from "@/components/AdvancedSearch";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const navigate = useNavigate();

  // A função onSearch é necessária para o AdvancedSearch, mas a navegação
  // já é tratada pelo componente interno.
  const handleSearch = (query: string) => {
    // Atualiza a URL se a busca for feita dentro do AdvancedSearch
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Busca Avançada</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdvancedSearch initialQuery={initialQuery} onSearch={handleSearch} />
      </div>
    </div>
  );
}