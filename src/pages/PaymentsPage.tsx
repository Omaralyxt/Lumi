import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function PaymentsPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/account')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-title text-3xl ml-3">Métodos de Pagamento</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cartões e Carteiras Digitais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Adicione ou gerencie seus cartões de crédito/débito e configure carteiras digitais como M-Pesa e eMola.</p>
          <Button className="mt-4">Adicionar Método de Pagamento</Button>
        </CardContent>
      </Card>
    </div>
  );
}