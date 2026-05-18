import React from 'react';
import { Truck, AlertTriangle, DollarSign, ShoppingBag } from 'lucide-react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { StatsCard } from '../../components/business/StatsCard';
import { ProductTable } from '../../components/business/ProductTable';
import { CTASection } from '../../components/business/CTASection';
import type { Product } from '../../components/business/ProductRow';

const BusinessDashboard: React.FC = () => {
  // Mock business dataset
  const products: Product[] = [
    {
      id: 'PRD-001',
      name: 'Aceite de Motor Sintético 5W-30',
      category: 'Lubricantes',
      stock: 145,
      price: '$42.99',
      status: 'En Stock',
    },
    {
      id: 'PRD-002',
      name: 'Filtro de Aire Premium K&N',
      category: 'Filtros',
      stock: 8,
      price: '$67.50',
      status: 'Bajo Stock',
    },
    {
      id: 'PRD-003',
      name: 'Pastillas de Freno Cerámicas',
      category: 'Frenos',
      stock: 0,
      price: '$89.99',
      status: 'Agotado',
    },
    {
      id: 'PRD-004',
      name: 'Batería AGM 12V 70Ah',
      category: 'Eléctrico',
      stock: 32,
      price: '$185.00',
      status: 'En Stock',
    },
    {
      id: 'PRD-005',
      name: 'Kit de Embrague Completo',
      category: 'Transmisión',
      stock: 5,
      price: '$320.00',
      status: 'Bajo Stock',
    },
    {
      id: 'PRD-006',
      name: 'Amortiguador Delantero Sport',
      category: 'Suspensión',
      stock: 67,
      price: '$156.75',
      status: 'En Stock',
    },
  ];

  const handleEdit = (id: string) => {
    console.log('Edit product:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete product:', id);
  };

  const handleView = (id: string) => {
    console.log('View product:', id);
  };

  const handleAddProduct = () => {
    console.log('Add new product');
  };

  return (
    <BusinessLayout
      title="Panel de Proveedor"
      subtitle="Bienvenido de vuelta — aquí tienes un resumen de tu negocio"
    >
      {/* KPI Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Truck}
          label="Entregas Pendientes"
          value={24}
          change="+8.3%"
          changeType="up"
          accentColor="blue"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Stock Bajo"
          value={7}
          change="-12.5%"
          changeType="down"
          accentColor="cyan"
        />
        <StatsCard
          icon={DollarSign}
          label="Ventas del Mes"
          value={18420}
          prefix="$"
          change="+23.1%"
          changeType="up"
          accentColor="emerald"
        />
        <StatsCard
          icon={ShoppingBag}
          label="Pedidos Nuevos"
          value={156}
          change="+4.7%"
          changeType="up"
          accentColor="violet"
        />
      </div>

      {/* Product Table Section */}
      <div className="mb-8">
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* CTA Section */}
      <CTASection onAddProduct={handleAddProduct} />
    </BusinessLayout>
  );
};

export default BusinessDashboard;
