"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterStatus = "all" | "pending" | "completed";
type FilterPriority = "all" | "low" | "medium" | "high";
type SortBy = "priority" | "dueDate" | "createdAt";

interface TodoFiltersProps {
  filterStatus: FilterStatus;
  filterPriority: FilterPriority;
  sortBy: SortBy;
  onFilterStatusChange: (status: FilterStatus) => void;
  onFilterPriorityChange: (priority: FilterPriority) => void;
  onSortByChange: (sort: SortBy) => void;
}

export function TodoFilters({
  filterStatus,
  filterPriority,
  sortBy,
  onFilterStatusChange,
  onFilterPriorityChange,
  onSortByChange,
}: TodoFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-wrap gap-2">
          <Button
            onClick={() => onFilterStatusChange("all")}
            size="sm"
            variant={filterStatus === "all" ? "default" : "outline"}
          >
            Todas
          </Button>
          <Button
            onClick={() => onFilterStatusChange("pending")}
            size="sm"
            variant={filterStatus === "pending" ? "default" : "outline"}
          >
            Pendientes
          </Button>
          <Button
            onClick={() => onFilterStatusChange("completed")}
            size="sm"
            variant={filterStatus === "completed" ? "default" : "outline"}
          >
            Completadas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block font-medium text-sm"
            htmlFor="priority-filter"
          >
            Prioridad
          </label>
          <Select onValueChange={onFilterPriorityChange} value={filterPriority}>
            <SelectTrigger id="priority-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            className="mb-2 block font-medium text-sm"
            htmlFor="sort-filter"
          >
            Ordenar por
          </label>
          <Select onValueChange={onSortByChange} value={sortBy}>
            <SelectTrigger id="sort-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Prioridad</SelectItem>
              <SelectItem value="dueDate">Fecha vencimiento</SelectItem>
              <SelectItem value="createdAt">Fecha creación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
