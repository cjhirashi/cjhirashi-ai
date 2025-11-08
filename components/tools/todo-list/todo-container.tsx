"use client";

import { X } from "lucide-react";
import { useCallback, useState } from "react";
import {
  createServerTodo,
  deleteServerTodo,
  updateServerTodo,
} from "@/app/(dashboard)/tools/todo-list/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TodoItem as TodoItemType } from "@/lib/db/schema";
import { TodoFilters } from "./todo-filters";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";

interface TodoContainerProps {
  initialTodos: TodoItemType[];
  onRefresh: () => Promise<void>;
}

type FilterStatus = "all" | "pending" | "completed";
type FilterPriority = "all" | "low" | "medium" | "high";
type SortBy = "priority" | "dueDate" | "createdAt";

export function TodoContainer({ initialTodos, onRefresh }: TodoContainerProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItemType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleCreateTodo = useCallback(
    async (data: {
      title: string;
      description?: string;
      priority: "low" | "medium" | "high";
      dueDate?: Date;
    }) => {
      setIsFormLoading(true);
      try {
        if (editingTodo) {
          await updateServerTodo({
            id: editingTodo.id,
            ...data,
          });
          toast({
            title: "Éxito",
            description: "Tarea actualizada correctamente",
          });
          setEditingTodo(null);
        } else {
          await createServerTodo(data);
          toast({
            title: "Éxito",
            description: "Tarea creada correctamente",
          });
        }

        setShowForm(false);
        await onRefresh();
      } catch (error) {
        toast({
          title: "Error",
          description: editingTodo
            ? "No se pudo actualizar la tarea"
            : "No se pudo crear la tarea",
          variant: "destructive",
        });
      } finally {
        setIsFormLoading(false);
      }
    },
    [editingTodo, onRefresh, toast]
  );

  const handleToggleTodo = useCallback(
    async (id: string, completed: boolean) => {
      try {
        await updateServerTodo({ id, completed });
        await onRefresh();
      } catch (error) {
        throw error;
      }
    },
    [onRefresh]
  );

  const handleDeleteTodo = useCallback(
    async (id: string) => {
      try {
        await deleteServerTodo({ id });
        await onRefresh();
      } catch (error) {
        throw error;
      }
    },
    [onRefresh]
  );

  const handleEdit = useCallback((todo: TodoItemType) => {
    setEditingTodo(todo);
    setShowForm(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTodo(null);
    setShowForm(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div>
        {showForm ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {editingTodo ? "Editar tarea" : "Nueva tarea"}
              </h2>
              <Button
                aria-label="Cerrar formulario"
                onClick={handleCancelEdit}
                size="sm"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TodoForm
              initialData={editingTodo || undefined}
              isEditing={Boolean(editingTodo)}
              isLoading={isFormLoading}
              onSubmit={handleCreateTodo}
            />
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => setShowForm(true)}
            size="lg"
          >
            Crear Nueva Tarea
          </Button>
        )}
      </div>

      {/* Filters Section */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="mb-4 font-semibold">Filtros y Ordenamiento</h3>
        <TodoFilters
          filterPriority={filterPriority}
          filterStatus={filterStatus}
          onFilterPriorityChange={setFilterPriority}
          onFilterStatusChange={setFilterStatus}
          onSortByChange={setSortBy}
          sortBy={sortBy}
        />
      </div>

      {/* List Section */}
      <div>
        <TodoList
          filterPriority={filterPriority}
          filterStatus={filterStatus}
          initialTodos={initialTodos}
          onDelete={handleDeleteTodo}
          onEdit={handleEdit}
          onToggle={handleToggleTodo}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
