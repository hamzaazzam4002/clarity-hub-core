import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/StatusBadge";

const mockSaleDetail = {
  id: "1",
  invoiceNo: "INV-2024-001",
  date: "January 15, 2024",
  dueDate: "January 30, 2024",
  status: "paid" as const,
  customer: {
    name: "Acme Corporation",
    address: "123 Business Street, Suite 100",
    city: "New York, NY 10001",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
  },
  items: [
    { id: "1", name: "Wireless Keyboard", quantity: 5, price: 79.99 },
    { id: "2", name: "USB-C Hub", quantity: 10, price: 49.99 },
    { id: "3", name: "Monitor Stand", quantity: 5, price: 89.99 },
  ],
  subtotal: 1349.75,
  tax: 134.98,
  total: 1484.73,
  paid: 1484.73,
};

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sale = mockSaleDetail;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sales")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{sale.invoiceNo}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <Card>
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">BizManager</h2>
              <p className="text-sm text-muted-foreground">Business Management System</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">INVOICE</h3>
              <p className="font-medium">{sale.invoiceNo}</p>
              <StatusBadge
                status={sale.status === "paid" ? "active" : "warning"}
                label={sale.status === "paid" ? "Paid" : "Pending"}
              />
            </div>
          </div>

          {/* Dates and Customer */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-muted-foreground">Bill To:</h4>
              <p className="font-medium">{sale.customer.name}</p>
              <p className="text-sm text-muted-foreground">{sale.customer.address}</p>
              <p className="text-sm text-muted-foreground">{sale.customer.city}</p>
              <p className="text-sm text-muted-foreground">{sale.customer.email}</p>
            </div>
            <div className="sm:text-right">
              <div className="mb-2">
                <span className="text-muted-foreground">Invoice Date: </span>
                <span className="font-medium">{sale.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Due Date: </span>
                <span className="font-medium">{sale.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
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
                {sale.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{item.name}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${sale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${sale.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${sale.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Paid</span>
                <span>${sale.paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Balance Due</span>
                <span>${(sale.total - sale.paid).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-1">Payment is due within 15 days of invoice date.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
