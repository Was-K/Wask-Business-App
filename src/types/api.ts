/**
 * Shared API contract types for Wask Business App.
 * Roles: ADMIN | CUSTOMER | BUSINESS_OWNER | DELIVERY
 * CUSTOMER and DELIVERY are blocked at the frontend login; they use mobile/delivery apps.
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

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'BUSINESS_OWNER' | 'DELIVERY';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type OperationalStatus = 'ACTIVE' | 'PAUSED' | 'SUSPENDED';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type ProductApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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

export interface Business {
  id: string;
  companyName: string;
  businessIdentifier: string;
  fiscalData?: Record<string, unknown> | null;
  address?: string | null;
  phone?: string | null;
  industry?: string | null;
  logo?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  operationalStatus?: OperationalStatus;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string | null;
  users?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  businessId?: string | null;
  status?: UserStatus;
  isVerified?: boolean;
  business?: Business | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code?: string;
  address?: string;
  region?: string;
  [key: string]: unknown;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  availableStock: number;
  reservedStock?: number;
  minimumStock?: number;
  product?: Product;
  warehouse?: Warehouse;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  category: string;
  subcategory?: string | null;
  images?: unknown;
  businessId: string;
  minimumStock?: number;
  maximumStock?: number | null;
  price: number | string;
  currency?: string;
  status: ProductStatus;
  approvalStatus?: ProductApprovalStatus;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  business?: Business;
  inventory?: InventoryItem[];
}

export interface CreateProductDto {
  sku: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  barcode?: string;
  subcategory?: string;
  images?: unknown;
  minimumStock?: number;
  maximumStock?: number;
  status?: ProductStatus;
  businessId?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;

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
  orderNumber?: string;
  customerId: string;
  businessId: string;
  deliveryUserId?: string | null;
  items: OrderItem[];
  status: OrderStatus;
  subtotal?: number | string;
  deliveryFee?: number | string;
  taxTotal?: number | string;
  grandTotal?: number | string;
  currency?: string;
  notes?: string;
  deliveryAddress?: string;
  customer?: User;
  business?: Business;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  businessId: string;
  items: Array<{ productId: string; quantity: number }>;
  notes?: string;
  deliveryAddress?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  message?: string;
}

export interface DashboardSummary {
  totalOrders?: number;
  pendingOrders?: number;
  totalProducts?: number;
  lowStockItems?: number;
  totalRevenue?: number;
  productsPendingApproval?: number;
  averageTicket?: number;
  [key: string]: unknown;
}

export interface AdminOverview {
  totalUsers?: number;
  totalCustomers?: number;
  totalBusinesses?: number;
  pendingBusinesses?: number;
  pendingProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  [key: string]: unknown;
}

export interface StockMovementDto {
  inventoryItemId: string;
  type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'RESERVATION' | 'RELEASE';
  quantity: number;
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

// ---------------------------------------------------------------------------
// Deprecated — kept temporarily to avoid breaking imports that haven't been
// migrated yet. Do not use in new code. Use Business instead.
// ---------------------------------------------------------------------------

/** @deprecated Use Business instead */
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

/** @deprecated Use CreateBusinessDto instead */
export interface CreateSupplierDto {
  supplierName: string;
  businessIdentifier: string;
  companyData?: Record<string, unknown>;
  certifications?: Record<string, unknown>;
  operationalRegions?: Record<string, unknown>;
}

/** @deprecated */
export type UpdateSupplierDto = Partial<CreateSupplierDto>;

// Legacy alias kept to avoid breaking builds; prefer VerificationStatus.
export type InventoryMovement = StockMovementDto & { id?: string; warehouseId?: string; productId?: string };
