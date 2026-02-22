import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, Package, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { reportsApi } from "@/lib/api";

export default function Reports() {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: profitData } = useQuery({
    queryKey: ["report-profit", dateFrom, dateTo],
    queryFn: () => reportsApi.profit({ startDate: dateFrom || undefined, endDate: dateTo || undefined }),
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["report-inventory"],
    queryFn: reportsApi.inventoryValuation,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Generate and analyze business reports" />

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
          <div className="grid gap-2">
            <Label>From Date</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>To Date</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profit" className="gap-2"><TrendingUp className="h-4 w-4" />Profit</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2"><Package className="h-4 w-4" />Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="profit" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${(profitData?.totalRevenue ?? 0).toLocaleString()}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">${(profitData?.totalCost ?? 0).toLocaleString()}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Gross Profit</p>
              <p className="text-2xl font-bold text-success">${(profitData?.grossProfit ?? 0).toLocaleString()}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">{profitData?.totalSales ?? 0}</p>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card><CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            <p className="text-2xl font-bold">${(inventoryData?.totalInventoryValue ?? 0).toLocaleString()}</p>
          </CardContent></Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Products Valuation</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(inventoryData?.products || []).map((p) => (
                  <div key={p.productId} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.sku} • {p.quantityInStock} units</p>
                    </div>
                    <span className="font-medium">${p.inventoryValue.toLocaleString()}</span>
                  </div>
                ))}
                {(inventoryData?.products || []).length === 0 && (
                  <p className="py-4 text-center text-muted-foreground">No inventory data</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
