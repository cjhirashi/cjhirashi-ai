"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TodoItem } from "@/lib/db/schema";

interface TodoFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    dueDate?: Date;
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<TodoItem>;
  isEditing?: boolean;
}

export function TodoForm({
  onSubmit,
  isLoading = false,
  initialData,
  isEditing = false,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    (initialData?.priority as "low" | "medium" | "high") || "medium"
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onSubmit({
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    // Reset form only if not editing
    if (!isEditing) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Tarea" : "Nueva Tarea"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              aria-required="true"
              disabled={isLoading}
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              required
              value={title}
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              disabled={isLoading}
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade más detalles (opcional)"
              rows={3}
              value={description}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                disabled={isLoading}
                onValueChange={(value) =>
                  setPriority(value as "low" | "medium" | "high")
                }
                value={priority}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Fecha de vencimiento</Label>
              <Input
                disabled={isLoading}
                id="dueDate"
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                value={dueDate}
              />
            </div>
          </div>

          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading
              ? "Guardando..."
              : isEditing
                ? "Actualizar"
                : "Crear Tarea"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
