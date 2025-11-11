import React from 'react';
import { ArrowLeft, Gift, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils'; // Importação adicionada

export default function CouponsPage() {
  const navigate = useNavigate();
  const credits = 1500; // Mocked
  const couponsCount = 3; // Mocked
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/account')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-title text-3xl ml-3">Cupons e Créditos</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédito Disponível</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(credits)}</div>
            <p className="text-xs text-gray-500">Crédito de reembolso e bônus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cupons Ativos</CardTitle>
            <Gift className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponsCount}</div>
            <p className="text-xs text-gray-500">Cupons prontos para usar</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Meus Cupons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Nenhum cupom listado no momento.</p>
        </CardContent>
      </Card>
    </div>
  );
}