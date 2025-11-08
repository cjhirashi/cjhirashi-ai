"use client";

import { format, isPast, isToday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { TodoItem as TodoItemType } from "@/lib/db/schema";
import { PriorityBadge } from "./priority-badge";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onEdit: (todo: TodoItemType) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

function getDueDateDisplay(dueDate: Date | null): {
  label: string;
  isDue: boolean;
  isOverdue: boolean;
} {
  if (!dueDate) {
    return { label: "", isDue: false, isOverdue: false };
  }

  const date = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (isToday(date)) {
    return { label: "Hoy", isDue: true, isOverdue: false };
  }

  if (isTomorrow(date)) {
    return { label: "Mañana", isDue: false, isOverdue: false };
  }

  if (isPast(date)) {
    return {
      label: format(date, "d MMM", { locale: es }),
      isDue: false,
      isOverdue: true,
    };
  }

  return {
    label: format(date, "d MMM", { locale: es }),
    isDue: false,
    isOverdue: false,
  };
}

export function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isLoading = false,
}: TodoItemProps) {
  const dueDateDisplay = getDueDateDisplay(todo.dueDate);
  const isOverdue = dueDateDisplay.isOverdue && !todo.completed;

  return (
    <Card
      className={`p-4 transition-all ${
        todo.completed
          ? "bg-muted opacity-60"
          : isOverdue
            ? "border-red-200 bg-red-50"
            : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            aria-label={`Marcar tarea como ${todo.completed ? "pendiente" : "completada"}`}
            checked={todo.completed}
            className="mt-1"
            disabled={isLoading}
            onCheckedChange={() => onToggle(todo.id, !todo.completed)}
          />

          <div className="min-w-0 flex-1">
            <h3
              className={`break-words font-medium ${
                todo.completed ? "text-muted-foreground line-through" : ""
              }`}
            >
              {todo.title}
            </h3>

            {todo.description && (
              <p
                className={`mt-1 break-words text-sm ${
                  todo.completed
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {todo.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              <PriorityBadge priority={todo.priority} />

              {dueDateDisplay.label && (
                <div
                  className={`rounded-full px-2 py-1 text-xs ${
                    isOverdue
                      ? "bg-red-200 font-medium text-red-800"
                      : dueDateDisplay.isDue
                        ? "bg-orange-100 font-medium text-orange-800"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {dueDateDisplay.label}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-shrink-0 gap-2">
            <Button
              aria-label="Editar tarea"
              disabled={isLoading}
              onClick={() => onEdit(todo)}
              size="sm"
              variant="ghost"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Eliminar tarea"
              disabled={isLoading}
              onClick={() => onDelete(todo.id)}
              size="sm"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
