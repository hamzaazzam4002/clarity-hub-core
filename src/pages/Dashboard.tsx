import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  ShoppingCart,
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

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
];

const topProducts = [
  { name: "Product A", sales: 450 },
  { name: "Product B", sales: 380 },
  { name: "Product C", sales: 320 },
  { name: "Product D", sales: 280 },
  { name: "Product E", sales: 220 },
];

const recentTransactions = [
  { id: "INV-001", customer: "Acme Corp", amount: 2500, status: "Paid" },
  { id: "INV-002", customer: "Tech Solutions", amount: 1800, status: "Pending" },
  { id: "INV-003", customer: "Global Trade", amount: 3200, status: "Paid" },
  { id: "INV-004", customer: "Local Shop", amount: 950, status: "Overdue" },
];

export default function Dashboard() {
  const navigate = useNavigate();

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
          title="Today's Sales"
          value="$12,450"
          subtitle="32 transactions"
          icon={DollarSign}
          trend={{ value: 12, positive: true }}
          variant="primary"
        />
        <StatCard
          title="Total Revenue"
          value="$284,500"
          subtitle="This month"
          icon={TrendingUp}
          trend={{ value: 8, positive: true }}
          variant="success"
        />
        <StatCard
          title="Low Stock Items"
          value="18"
          subtitle="Needs attention"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Pending Payments"
          value="$8,420"
          subtitle="5 invoices"
          icon={Clock}
          variant="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
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
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/sales")}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{tx.customer}</p>
                    <p className="text-sm text-muted-foreground">{tx.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${tx.amount.toLocaleString()}</p>
                  <span
                    className={`text-xs font-medium ${
                      tx.status === "Paid"
                        ? "text-success"
                        : tx.status === "Pending"
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  >
                    {tx.status}
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
