import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
    className?: string;
  }[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead className="border-b bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  "border-b transition-colors last:border-0",
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render
                      ? col.render(item)
                      : (item as Record<string, unknown>)[col.key]?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
