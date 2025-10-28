"use client";

import React, { useState, useCallback } from "react";
import { ArrowLeft, Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TrackingStep {
  status: string;
  date: string;
  icon: React.ElementType;
  color: string;
}

const getTrackingHistory = (orderNumber: string): TrackingStep[] => {
  // Simulação de rastreamento baseado no último dígito do número do pedido
  const lastDigit = parseInt(orderNumber.slice(-1)) || 0;
  
  const baseHistory: TrackingStep[] = [
    { status: "Pedido Recebido", date: "2024-08-01 10:00", icon: Package, color: "text-blue-600" },
    { status: "Pagamento Confirmado", date: "2024-08-01 10:15", icon: CheckCircle, color: "text-green-600" },
    { status: "Preparando para Envio", date: "2024-08-01 14:30", icon: Clock, color: "text-yellow-600" },
    { status: "Enviado", date: "2024-08-02 09:00", icon: Truck, color: "text-purple-600" },
    { status: "Em Trânsito", date: "2024-08-03 11:00", icon: Truck, color: "text-purple-600" },
    { status: "Entregue", date: "2024-08-04 15:00", icon: CheckCircle, color: "text-green-600" },
  ];

  if (lastDigit % 3 === 0) {
    // Pedido Cancelado
    return [
      ...baseHistory.slice(0, 2),
      { status: "Cancelado pelo Vendedor", date: "2024-08-02 11:00", icon: XCircle, color: "text-red-600" },
    ];
  } else if (lastDigit % 2 === 0) {
    // Pedido em Trânsito
    return baseHistory.slice(0, 5);
  } else {
    // Pedido Entregue
    return baseHistory;
  }
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingStep[] | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const navigate = useNavigate();

  const handleTrack = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    
    if (orderNumber.trim().length < 5) {
      toast.error("Por favor, insira um número de pedido válido.");
      setTrackingResult(null);
      return;
    }

    // Simulação de busca
    const result = getTrackingHistory(orderNumber.trim());
    setTrackingResult(result);
    
    if (result.length === 0) {
      toast.error("Pedido não encontrado.");
    } else {
      toast.success(`Status do pedido #${orderNumber} carregado.`);
    }
  }, [orderNumber]);

  const currentStatus = trackingResult ? trackingResult[trackingResult.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Acompanhar Pedido</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              Buscar Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="flex space-x-3">
              <Input
                type="text"
                placeholder="Insira o número do pedido (Ex: LMI-20240801-1234)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit">Rastrear</Button>
            </form>
          </CardContent>
        </Card>

        {searchAttempted && !trackingResult && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p>Não foi possível encontrar o pedido com o número "{orderNumber}".</p>
            <p className="text-sm mt-2">Verifique o número e tente novamente.</p>
          </div>
        )}

        {trackingResult && currentStatus && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">
                Status do Pedido #{orderNumber}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Última atualização: <span className="font-semibold">{currentStatus.date}</span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                <currentStatus.icon className={`h-8 w-8 ${currentStatus.color}`} />
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{currentStatus.status}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Seu pedido está atualmente em: {currentStatus.status}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {trackingResult.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === trackingResult.length - 1;
                  const isCompleted = index < trackingResult.length - 1;
                  
                  return (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isLast ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <div className={`h-10 w-0.5 ${isCompleted ? 'bg-green-300' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div className={`pb-4 ${isLast ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                        <p className={`${isLast ? 'text-gray-900 dark:text-white' : ''}`}>{step.status}</p>
                        <p className="text-xs">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}