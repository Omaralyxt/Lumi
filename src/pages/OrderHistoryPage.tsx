"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const OrderHistoryPage = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Histórico de Pedidos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Seus Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum pedido encontrado. Faça sua primeira compra!</p>
          {/* Aqui será implementada a lógica para buscar e listar os pedidos reais */}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistoryPage;