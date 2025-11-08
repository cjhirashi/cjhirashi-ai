"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TodoEmptyStateProps {
  message?: string;
  subMessage?: string;
}

export function TodoEmptyState({
  message = "No hay tareas",
  subMessage = "Crea una nueva tarea para comenzar",
}: TodoEmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="font-semibold text-lg">{message}</h3>
      <p className="mt-2 text-muted-foreground">{subMessage}</p>
    </Card>
  );
}
