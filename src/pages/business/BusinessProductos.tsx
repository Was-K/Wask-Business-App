import React from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { ProductTable } from '../../components/business/ProductTable';
import { CTASection } from '../../components/business/CTASection';
import type { Product } from '../../components/business/ProductRow';

const BusinessProductos: React.FC = () => {
  const products: Product[] = [
    { id: 'PRD-001', name: 'Aceite de Motor Sintético 5W-30', category: 'Lubricantes', stock: 145, price: '$42.99', status: 'En Stock' },
    { id: 'PRD-002', name: 'Filtro de Aire Premium K&N', category: 'Filtros', stock: 8, price: '$67.50', status: 'Bajo Stock' },
    { id: 'PRD-003', name: 'Pastillas de Freno Cerámicas', category: 'Frenos', stock: 0, price: '$89.99', status: 'Agotado' },
    { id: 'PRD-004', name: 'Batería AGM 12V 70Ah', category: 'Eléctrico', stock: 32, price: '$185.00', status: 'En Stock' },
    { id: 'PRD-005', name: 'Kit de Embrague Completo', category: 'Transmisión', stock: 5, price: '$320.00', status: 'Bajo Stock' },
    { id: 'PRD-006', name: 'Amortiguador Delantero Sport', category: 'Suspensión', stock: 67, price: '$156.75', status: 'En Stock' },
    { id: 'PRD-007', name: 'Correa de Distribución Gates', category: 'Motor', stock: 23, price: '$45.00', status: 'En Stock' },
    { id: 'PRD-008', name: 'Radiador de Aluminio Racing', category: 'Refrigeración', stock: 41, price: '$289.99', status: 'En Stock' },
  ];

  return (
    <BusinessLayout title="Productos" subtitle="Gestión completa de tu catálogo de productos">
      <div className="space-y-6">
        <ProductTable products={products} />
        <CTASection />
      </div>
    </BusinessLayout>
  );
};

export default BusinessProductos;
