"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { TodoItem as TodoItemType } from "@/lib/db/schema";
import { TodoEmptyState } from "./todo-empty-state";
import { TodoItem } from "./todo-item";

interface TodoListProps {
  initialTodos: TodoItemType[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: TodoItemType) => void;
  filterStatus: "all" | "pending" | "completed";
  filterPriority: "all" | "low" | "medium" | "high";
  sortBy: "priority" | "dueDate" | "createdAt";
}

export function TodoList({
  initialTodos,
  onToggle,
  onDelete,
  onEdit,
  filterStatus,
  filterPriority,
  sortBy,
}: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Update todos when initialTodos changes
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const filteredAndSortedTodos = useCallback(() => {
    let filtered = todos;

    // Filter by status
    if (filterStatus === "pending") {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((t) => t.completed);
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        );
      }

      if (sortBy === "dueDate") {
        const aDate = a.dueDate
          ? new Date(a.dueDate).getTime()
          : Number.POSITIVE_INFINITY;
        const bDate = b.dueDate
          ? new Date(b.dueDate).getTime()
          : Number.POSITIVE_INFINITY;
        return aDate - bDate;
      }

      // createdAt (descending)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [todos, filterStatus, filterPriority, sortBy]);

  const handleToggle = useCallback(
    async (id: string, completed: boolean) => {
      setIsLoading(true);
      try {
        // Optimistic update
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed } : t))
        );

        await onToggle(id, completed);
      } catch (error) {
        // Revert optimistic update
        setTodos(initialTodos);
        toast({
          title: "Error",
          description: "No se pudo actualizar la tarea",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onToggle, initialTodos, toast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        // Optimistic update
        setTodos((prev) => prev.filter((t) => t.id !== id));

        await onDelete(id);
        setDeleteId(null);
        toast({
          title: "Éxito",
          description: "Tarea eliminada",
        });
      } catch (error) {
        // Revert optimistic update
        setTodos(initialTodos);
        toast({
          title: "Error",
          description: "No se pudo eliminar la tarea",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onDelete, initialTodos, toast]
  );

  const displayedTodos = filteredAndSortedTodos();

  return (
    <>
      {displayedTodos.length === 0 ? (
        <TodoEmptyState
          message={
            filterStatus === "completed"
              ? "Sin tareas completadas"
              : filterStatus === "pending"
                ? "Sin tareas pendientes"
                : "Sin tareas"
          }
          subMessage={
            filterStatus === "all"
              ? "Crea una nueva tarea para comenzar"
              : "Ajusta los filtros o crea una nueva tarea"
          }
        />
      ) : (
        <div className="space-y-2">
          {displayedTodos.map((todo) => (
            <TodoItem
              isLoading={isLoading}
              key={todo.id}
              onDelete={() => setDeleteId(todo.id)}
              onEdit={onEdit}
              onToggle={handleToggle}
              todo={todo}
            />
          ))}
        </div>
      )}

      <AlertDialog
        onOpenChange={() => setDeleteId(null)}
        open={deleteId !== null}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La tarea será eliminada
            permanentemente.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
