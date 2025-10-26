"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MpesaStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
}

type PaymentStatus = 'awaiting_confirmation' | 'paid' | 'failed' | 'timeout';

export default function MpesaStatusModal({ isOpen, onClose, orderId, orderNumber }: MpesaStatusModalProps) {
  const [status, setStatus] = useState<PaymentStatus>('awaiting_confirmation');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes timeout
  const navigate = useNavigate();

  // Simulação de Polling (Em um app real, você faria uma consulta à API aqui)
  useEffect(() => {
    if (!isOpen || status !== 'awaiting_confirmation') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulação de Webhook (A cada 15 segundos, simula a confirmação ou falha)
    const pollingSimulation = setTimeout(() => {
      // Em um app real, você faria:
      // const currentStatus = await checkOrderStatus(orderId);
      // if (currentStatus === 'paid') setStatus('paid');
      // else if (currentStatus === 'failed') setStatus('failed');
      
      // Simulação: 80% de chance de sucesso após 15 segundos
      if (Math.random() < 0.8) {
        setStatus('paid');
      } else {
        setStatus('failed');
      }
    }, 15000); // Espera 15 segundos para a confirmação inicial

    return () => {
      clearInterval(timer);
      clearTimeout(pollingSimulation);
    };
  }, [isOpen, status, orderId]);

  const handleClose = () => {
    if (status === 'paid') {
      navigate(`/order-confirmation/${orderId}`);
    } else {
      onClose();
    }
  };

  const handleRetry = () => {
    // Em um app real, você chamaria a função de pagamento novamente
    setStatus('awaiting_confirmation');
    setTimeLeft(120);
    toast.info("Tentando novamente... Por favor, verifique seu telemóvel.");
  };

  const renderContent = () => {
    switch (status) {
      case 'awaiting_confirmation':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <h3 className="text-xl font-semibold">Aguardando Confirmação M-Pesa</h3>
            <p className="text-gray-600">
              Por favor, insira seu PIN no seu telemóvel para autorizar o pagamento de MT {orderNumber.split('-')[3] || '...'} (Pedido #{orderNumber}).
            </p>
            <p className="text-sm text-gray-500">
              Tempo restante para confirmação: <span className="font-bold text-blue-600">{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
            </p>
            <Button variant="outline" onClick={handleClose} disabled={timeLeft > 100}>
              Cancelar Transação
            </Button>
          </div>
        );
      case 'paid':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-green-700">Pagamento Concluído!</h3>
            <p className="text-gray-600">
              Seu pedido foi confirmado e será processado.
            </p>
            <Button onClick={handleClose} className="w-full">
              Ver Confirmação do Pedido
            </Button>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-semibold text-red-700">Pagamento Falhou</h3>
            <p className="text-gray-600">
              O pagamento não foi concluído. Verifique seu saldo ou tente novamente.
            </p>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Usar Outro Método de Pagamento
            </Button>
          </div>
        );
      case 'timeout':
        return (
          <div className="text-center space-y-4">
            <Clock className="h-12 w-12 text-yellow-600 mx-auto" />
            <h3 className="text-xl font-semibold text-yellow-700">Tempo Esgotado</h3>
            <p className="text-gray-600">
              Não recebemos a confirmação do seu PIN a tempo. Tente novamente.
            </p>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Usar Outro Método de Pagamento
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Status da Transação M-Pesa</DialogTitle>
          <DialogDescription>
            Acompanhe o status do seu pagamento em tempo real.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}