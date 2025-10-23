"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package, 
  CreditCard,
  Activity,
  MapPin,
  Filter,
  Download,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Mock data for the dashboard
const salesData = [
  { name: "Jan", vendas: 4000, receita: 2400 },
  { name: "Fev", vendas: 3000, receita: 1398 },
  { name: "Mar", vendas: 2000, receita: 9800 },
  { name: "Abr", vendas: 2780, receita: 3908 },
  { name: "Mai", vendas: 1890, receita: 4800 },
  { name: "Jun", vendas: 2390, receita: 3800 },
  { name: "Jul", vendas: 3490, receita: 4300 },
];

const topProducts = [
  { id: 1, name: "Smartphone Samsung Galaxy A54", vendas: 120, receita: 1500000 },
  { id: 2, name: "Fone de Ouvido Bluetooth", vendas: 95, receita: 190000 },
  { id: 3, name: "Notebook Dell Inspiron", vendas: 78, receita: 2234400 },
  { id: 4, name: "Smartwatch Apple Watch", vendas: 65, receita: 1462500 },
  { id: 5, name: "Câmera Canon EOS R6", vendas: 42, receita: 1890000 },
];

const recentOrders = [
  { id: "ORD-001234", cliente: "João Silva", produto: "Smartphone Samsung", valor: 12500, status: "Entregue", data: "2023-07-28" },
  { id: "ORD-001233", cliente: "Maria Santos", produto: "Fone Bluetooth", valor: 1999, status: "Enviado", data: "2023-07-27" },
  { id: "ORD-001232", cliente: "Carlos Mendes", produto: "Notebook Dell", valor: 28500, status: "Processando", data: "2023-07-26" },
  { id: "ORD-001231", cliente: "Ana Pereira", produto: "Smartwatch Apple", valor: 22500, status: "Entregue", data: "2023-07-25" },
  { id: "ORD-001230", cliente: "Pedro Costa", produto: "Câmera Canon", valor: 45000, status: "Cancelado", data: "2023-07-24" },
];

const citySales = [
  { name: "Maputo", value: 45 },
  { name: "Matola", value: 25 },
  { name: "Beira", value: 15 },
  { name: "Nampula", value: 10 },
  { name: "Outras", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const statusColors = {
  "Entregue": "bg-green-100 text-green-800",
  "Enviado": "bg-blue-100 text-blue-800",
  "Processando": "bg-yellow-100 text-yellow-800",
  "Cancelado": "bg-red-100 text-red-800",
};

export default function SalesDashboard() {
  const [timeRange, setTimeRange] = useState("Este mês");
  const [salesStats, setSalesStats] = useState({
    totalVendas: 0,
    receitaTotal: 0,
    clientes: 0,
    taxaConversao: 0
  });

  useEffect(() => {
    // Simulate fetching data
    setSalesStats({
      totalVendas: 1245,
      receitaTotal: 2340000,
      clientes: 892,
      taxaConversao: 24.5
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Vendas</h1>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hoje">Hoje</SelectItem>
                  <SelectItem value="Esta semana">Esta semana</SelectItem>
                  <SelectItem value="Este mês">Este mês</SelectItem>
                  <SelectItem value="Este ano">Este ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesStats.totalVendas.toLocaleString('pt-MZ')}</div>
              <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">MT {salesStats.receitaTotal.toLocaleString('pt-MZ')}</div>
              <p className="text-xs text-muted-foreground">+18% em relação ao mês passado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesStats.clientes.toLocaleString('pt-MZ')}</div>
              <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesStats.taxaConversao}%</div>
              <p className="text-xs text-muted-foreground">+2.3% em relação ao mês passado</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho de Vendas</CardTitle>
                <CardDescription>Vendas e receita ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`MT ${Number(value).toLocaleString('pt-MZ')}`, 'Receita']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Bar dataKey="vendas" name="Vendas" fill="#3b82f6" />
                    <Bar dataKey="receita" name="Receita" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Cidade</CardTitle>
                <CardDescription>Distribuição de vendas por região</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={citySales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {citySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentagem']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Pedidos mais recentes na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>MT {order.valor.toLocaleString('pt-MZ')}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Produtos com maior volume de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.vendas}</TableCell>
                      <TableCell>MT {product.receita.toLocaleString('pt-MZ')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}