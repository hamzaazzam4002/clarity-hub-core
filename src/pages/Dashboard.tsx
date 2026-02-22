import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Receipt,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { dashboardApi, salesApi } from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: overview } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: dashboardApi.overview,
  });

  const { data: salesByDate } = useQuery({
    queryKey: ["dashboard-sales-by-date"],
    queryFn: dashboardApi.salesByDate,
  });

  const { data: topProducts } = useQuery({
    queryKey: ["dashboard-top-products"],
    queryFn: dashboardApi.topProducts,
  });

  const { data: recentSales } = useQuery({
    queryKey: ["recent-sales"],
    queryFn: salesApi.list,
  });

  const salesChartData = (salesByDate || []).map((p) => ({
    name: `${p._id.month}/${p._id.day}`,
    sales: p.total,
  }));

  const topProductsData = (topProducts || []).map((p) => ({
    name: p._id,
    sales: p.totalSold,
  }));

  const recentTransactions = (recentSales || []).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/sales/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
          <Button variant="outline" onClick={() => navigate("/purchases/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`$${(overview?.totalSales ?? 0).toLocaleString()}`}
          subtitle={`${overview?.totalInvoices ?? 0} invoices`}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          title="Total Profit"
          value={`$${(overview?.totalProfit ?? 0).toLocaleString()}`}
          subtitle="Gross profit"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Low Stock Items"
          value={String(overview?.lowStock?.length ?? 0)}
          subtitle="Needs attention"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Net Profit"
          value={`$${(overview?.netProfit ?? 0).toLocaleString()}`}
          subtitle={`Expenses: $${(overview?.totalExpenses ?? 0).toLocaleString()}`}
          icon={Clock}
          variant="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {salesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesChartData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="name" stroke="hsl(220, 9%, 46%)" fontSize={12} />
                    <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 13%, 91%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No sales data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {topProductsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis type="number" stroke="hsl(220, 9%, 46%)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(220, 9%, 46%)" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 13%, 91%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="sales" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No product data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Sales</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/sales")}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">No recent sales</p>
            )}
            {recentTransactions.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/sales/${sale.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{sale.customer?.name || "Walk-in"}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${sale.totalAmount.toLocaleString()}</p>
                  <span
                    className={`text-xs font-medium ${
                      sale.paymentStatus === "PAID"
                        ? "text-success"
                        : sale.paymentStatus === "PARTIAL"
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  >
                    {sale.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
