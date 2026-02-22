import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { salesApi } from "@/lib/api";

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sale, isLoading } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => salesApi.get(id!),
    enabled: !!id,
  });

  const handleDownload = async () => {
    if (!id) return;
    try {
      const blob = await salesApi.downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  if (isLoading || !sale) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const statusMap = {
    PAID: { status: "active" as const, label: "Paid" },
    PARTIAL: { status: "warning" as const, label: "Partial" },
    UNPAID: { status: "danger" as const, label: "Unpaid" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sales")}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">Sale #{sale.id.slice(-8).toUpperCase()}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Mail className="mr-2 h-4 w-4" />Email</Button>
          <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download</Button>
          <Button size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">BizManager</h2>
              <p className="text-sm text-muted-foreground">Business Management System</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">INVOICE</h3>
              <p className="font-medium">{sale.id.slice(-8).toUpperCase()}</p>
              <StatusBadge {...statusMap[sale.paymentStatus]} />
            </div>
          </div>

          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-muted-foreground">Bill To:</h4>
              {sale.customer ? (
                <>
                  <p className="font-medium">{sale.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{sale.customer.phone}</p>
                  {sale.customer.email && <p className="text-sm text-muted-foreground">{sale.customer.email}</p>}
                  {sale.customer.address && <p className="text-sm text-muted-foreground">{sale.customer.address}</p>}
                </>
              ) : <p className="text-muted-foreground">Walk-in Customer</p>}
            </div>
            <div className="sm:text-right">
              <div className="mb-2"><span className="text-muted-foreground">Date: </span><span className="font-medium">{new Date(sale.createdAt).toLocaleDateString()}</span></div>
              <div><span className="text-muted-foreground">Sold by: </span><span className="font-medium">{sale.soldBy.name}</span></div>
            </div>
          </div>

          <div className="mb-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Item</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">Qty</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Price</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-4">{item.product}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${sale.totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-success"><span>Paid</span><span>${sale.amountPaid.toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-medium"><span>Balance Due</span><span>${sale.remainingAmount.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
