import { cn } from "@/lib/utils";

type StatusVariant = "active" | "inactive" | "warning" | "danger";

interface StatusBadgeProps {
  status: StatusVariant;
  label: string;
}

const statusClasses: Record<StatusVariant, string> = {
  active: "status-active",
  inactive: "status-inactive",
  warning: "status-warning",
  danger: "status-danger",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return <span className={statusClasses[status]}>{label}</span>;
}
