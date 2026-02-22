// API client generated from OpenAPI spec
// Change this to your production URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  costPrice: number | null;
  quantity: number;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  balance: number;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  product: string;
  quantity: number;
  costPrice: number;
}

export interface Purchase {
  id: string;
  supplier: Supplier;
  items: PurchaseItem[];
  totalAmount: number;
  status: "UNPAID" | "PARTIAL" | "PAID";
  amountPaid: number;
  createdBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  product: string;
  quantity: number;
  price: number;
  costPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  customer: Customer | null;
  soldBy: { id: string; name: string; email: string };
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  sale: string;
  amount: number;
  method: "CASH" | "CARD" | "TRANSFER";
  paidBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPayment {
  id: string;
  supplier: Supplier;
  purchase: Purchase;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "cheque";
  note: string | null;
  paidBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: "RENT" | "SALARY" | "UTILITIES" | "INTERNET" | "MAINTENANCE" | "OTHER";
  notes: string | null;
  expenseDate: string;
  createdBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  product: string;
  type: "SALE" | "PURCHASE" | "ADJUSTMENT" | "RETURN";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reference: string;
  referenceModel: string | null;
  createdBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  totalSales: number;
  totalInvoices: number;
  totalProfit: number;
  totalExpenses: number;
  netProfit: number;
  lowStock: { name: string; quantity: number; sku: string }[];
}

export interface SalesByDatePoint {
  _id: { year: number; month: number; day: number };
  total: number;
}

export interface TopProduct {
  _id: string;
  totalSold: number;
}

export interface ProfitReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  totalSales: number;
}

export interface InventoryValuationReport {
  totalInventoryValue: number;
  products: {
    productId: string;
    name: string;
    sku: string;
    quantityInStock: number;
    costPrice: number;
    inventoryValue: number;
  }[];
}

export interface PaginatedCustomers {
  customers: Customer[];
  pagination: { total: number; page: number; pages: number };
}

// ── API Response wrapper ───────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ── Token management ───────────────────────────────────────────

let authToken: string | null = localStorage.getItem("auth_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken() {
  return authToken;
}

// ── Fetch helper ───────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `API Error: ${res.status} ${res.statusText}`
    );
  }

  // For PDF downloads etc.
  if (res.headers.get("content-type")?.includes("application/pdf")) {
    return (await res.blob()) as unknown as T;
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// ── Auth ────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ── Users ───────────────────────────────────────────────────────

export const usersApi = {
  list: () => apiFetch<User[]>("/api/users"),
  get: (id: string) => apiFetch<User>(`/api/users/${id}`),
  create: (data: { name: string; email: string; password: string; role: string; isActive?: boolean }) =>
    apiFetch<User>("/api/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{ name: string; email: string; password: string; role: string; isActive: boolean }>) =>
    apiFetch<User>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/api/users/${id}`, { method: "DELETE" }),
};

// ── Products ────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    const qs = query.toString();
    return apiFetch<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => apiFetch<Product>(`/api/products/${id}`),
  create: (data: { name: string; sku: string; price: number; description?: string; costPrice?: number; quantity?: number; category?: string }) =>
    apiFetch<Product>("/api/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>) =>
    apiFetch<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
};

// ── Customers ───────────────────────────────────────────────────

export const customersApi = {
  list: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiFetch<PaginatedCustomers>(`/api/customers${qs ? `?${qs}` : ""}`);
  },
  create: (data: { name: string; phone: string; email?: string; address?: string; notes?: string }) =>
    apiFetch<Customer>("/api/customers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Customer>) =>
    apiFetch<Customer>(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (id: string) =>
    apiFetch<Customer>(`/api/customers/toggle/${id}`, { method: "PATCH" }),
};

// ── Suppliers ───────────────────────────────────────────────────

export const suppliersApi = {
  list: () => apiFetch<Supplier[]>("/api/suppliers"),
  create: (data: { name: string; email?: string; phone?: string; address?: string }) =>
    apiFetch<Supplier>("/api/suppliers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Supplier>) =>
    apiFetch<Supplier>(`/api/suppliers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (id: string) =>
    apiFetch<Supplier>(`/api/suppliers/toggle/${id}`, { method: "PATCH" }),
};

// ── Purchases ───────────────────────────────────────────────────

export const purchasesApi = {
  list: () => apiFetch<Purchase[]>("/api/purchases"),
  create: (data: { supplier: string; items: { product: string; quantity: number; costPrice: number }[] }) =>
    apiFetch<Purchase>("/api/purchases", { method: "POST", body: JSON.stringify(data) }),
};

// ── Supplier Payments ───────────────────────────────────────────

export const supplierPaymentsApi = {
  list: () => apiFetch<SupplierPayment[]>("/api/supplier-payments"),
  create: (data: { purchaseId: string; amount: number; paymentMethod?: string; note?: string }) =>
    apiFetch<SupplierPayment>("/api/supplier-payments", { method: "POST", body: JSON.stringify(data) }),
};

// ── Expenses ────────────────────────────────────────────────────

export const expensesApi = {
  list: (params?: { category?: string; from?: string; to?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);
    const qs = query.toString();
    return apiFetch<Expense[]>(`/api/expenses${qs ? `?${qs}` : ""}`);
  },
  create: (data: { title: string; amount: number; category?: string; notes?: string; expenseDate?: string }) =>
    apiFetch<Expense>("/api/expenses", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/api/expenses/${id}`, { method: "DELETE" }),
};

// ── Inventory ───────────────────────────────────────────────────

export const inventoryApi = {
  adjust: (data: { productId: string; quantity: number }) =>
    apiFetch<Product>("/api/inventory/adjust", { method: "POST", body: JSON.stringify(data) }),
  history: (productId: string) =>
    apiFetch<InventoryLog[]>(`/api/inventory/${productId}`),
};

// ── Sales ───────────────────────────────────────────────────────

export const salesApi = {
  list: () => apiFetch<Sale[]>("/api/sales"),
  get: (id: string) => apiFetch<Sale>(`/api/sales/${id}`),
  create: (data: { items: { product: string; quantity: number }[]; customer?: string; amountPaid?: number }) =>
    apiFetch<Sale>("/api/sales", { method: "POST", body: JSON.stringify(data) }),
  downloadInvoice: (saleId: string) =>
    apiFetch<Blob>(`/api/sales/invoice/${saleId}`),
};

// ── Payments ────────────────────────────────────────────────────

export const paymentsApi = {
  create: (data: { saleId: string; amount: number; method: "CASH" | "CARD" | "TRANSFER" }) =>
    apiFetch<Payment>("/api/payments", { method: "POST", body: JSON.stringify(data) }),
  listBySale: (saleId: string) =>
    apiFetch<Payment[]>(`/api/payments/${saleId}`),
};

// ── Reports ─────────────────────────────────────────────────────

export const reportsApi = {
  profit: (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    const qs = query.toString();
    return apiFetch<ProfitReport>(`/api/reports/profit${qs ? `?${qs}` : ""}`);
  },
  inventoryValuation: () =>
    apiFetch<InventoryValuationReport>("/api/reports/inventory-valuation"),
};

// ── Dashboard ───────────────────────────────────────────────────

export const dashboardApi = {
  overview: () => apiFetch<DashboardOverview>("/api/dashboard/overview"),
  salesByDate: () => apiFetch<SalesByDatePoint[]>("/api/dashboard/sales-by-date"),
  topProducts: () => apiFetch<TopProduct[]>("/api/dashboard/top-products"),
};
