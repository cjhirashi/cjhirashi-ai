import { Badge } from "@/components/ui/badge";

type Priority = "low" | "medium" | "high";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: {
    label: "Baja",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  medium: {
    label: "Media",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  high: {
    label: "Alta",
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge className={config.className} variant="secondary">
      {config.label}
    </Badge>
  );
}
