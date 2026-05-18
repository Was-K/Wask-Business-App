/**
 * Shared API contract types.
 * The backend wraps every response in { success, data, timestamp } via a global interceptor.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export interface ApiErrorPayload {
  success: false;
  message?: string;
  error?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type UserRole = 'ADMIN' | 'BUSINESS' | 'SUPPLIER';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  barcode?: string;
  supplierId: string;
  price: number;
  minimumStock?: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  category: string;
  supplierId: string;
  price: number;
  description?: string;
  barcode?: string;
  subcategory?: string;
  minimumStock?: number;
  status?: ProductStatus;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface Supplier {
  id: string;
  supplierName: string;
  businessIdentifier: string;
  companyData?: Record<string, unknown>;
  certifications?: Record<string, unknown>;
  operationalRegions?: Record<string, unknown>;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierDto {
  supplierName: string;
  businessIdentifier: string;
  companyData?: Record<string, unknown>;
  certifications?: Record<string, unknown>;
  operationalRegions?: Record<string, unknown>;
}

export type UpdateSupplierDto = Partial<CreateSupplierDto>;

export interface Business {
  id: string;
  companyName: string;
  businessIdentifier: string;
  address?: string;
  phone?: string;
  industry?: string;
  approved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBusinessDto {
  companyName: string;
  businessIdentifier: string;
  address?: string;
  phone?: string;
  industry?: string;
}

export type UpdateBusinessDto = Partial<CreateBusinessDto>;

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice?: number;
  product?: Product;
}

export interface Order {
  id: string;
  businessId: string;
  supplierId: string;
  items: OrderItem[];
  status: OrderStatus;
  notes?: string;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  businessId: string;
  supplierId: string;
  items: Array<{ productId: string; quantity: number }>;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  message?: string;
}

export interface DashboardSummary {
  totalOrders?: number;
  pendingOrders?: number;
  totalSuppliers?: number;
  totalProducts?: number;
  totalRevenue?: number;
  [key: string]: unknown;
}

export interface AdminOverview {
  totalUsers?: number;
  totalBusinesses?: number;
  totalSuppliers?: number;
  pendingApprovals?: number;
  [key: string]: unknown;
}

export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  [key: string]: unknown;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  [key: string]: unknown;
}

export interface InventoryMovement {
  id?: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  reason?: string;
}

export interface Notification {
  id: string;
  title: string;
  body?: string;
  read?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AppSettings {
  [key: string]: unknown;
}
