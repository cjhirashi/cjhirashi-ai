import { Upload } from "lucide-react";

export function FileEmptyState() {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 font-semibold">Sin archivos</h3>
      <p className="mt-2 text-muted-foreground text-sm">
        Comienza subiendo tu primer archivo arrastrándolo aquí o seleccionándolo
        desde tu equipo
      </p>
    </div>
  );
}
