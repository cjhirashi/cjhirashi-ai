"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StoredFile } from "@/lib/db/schema";
import { FileEmptyState } from "./file-empty-state";
import { FileItem } from "./file-item";

interface FileListProps {
  files: StoredFile[];
  onDelete: (fileId: string) => Promise<void>;
  isDeleting?: boolean;
  deletingFileId?: string | null;
}

type SortOption =
  | "date-desc"
  | "date-asc"
  | "size-desc"
  | "size-asc"
  | "name-asc"
  | "name-desc";
type FilterType = "all" | "images" | "documents";
type FilterDate = "all" | "today" | "week" | "month";

export function FileList({
  files,
  onDelete,
  isDeleting = false,
  deletingFileId = null,
}: FileListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterDate, setFilterDate] = useState<FilterDate>("all");

  // Get date ranges for filtering
  const getDateRange = (
    option: FilterDate
  ): { start: Date; end: Date } | null => {
    const now = new Date();
    const start = new Date();

    switch (option) {
      case "today":
        start.setHours(0, 0, 0, 0);
        return { start, end: now };
      case "week":
        start.setDate(now.getDate() - 7);
        return { start, end: now };
      case "month":
        start.setMonth(now.getMonth() - 1);
        return { start, end: now };
      case "all":
      default:
        return null;
    }
  };

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    let result = [...files];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((file) =>
        file.fileName.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType === "images") {
      result = result.filter((file) => file.fileType.startsWith("image/"));
    } else if (filterType === "documents") {
      result = result.filter((file) => !file.fileType.startsWith("image/"));
    }

    // Date filter
    const dateRange = getDateRange(filterDate);
    if (dateRange) {
      result = result.filter(
        (file) =>
          file.uploadedAt >= dateRange.start && file.uploadedAt <= dateRange.end
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          );
        case "size-desc":
          return b.fileSize - a.fileSize;
        case "size-asc":
          return a.fileSize - b.fileSize;
        case "name-asc":
          return a.fileName.localeCompare(b.fileName);
        case "name-desc":
          return b.fileName.localeCompare(a.fileName);
        default:
          return 0;
      }
    });

    return result;
  }, [files, searchQuery, sortBy, filterType, filterDate]);

  if (files.length === 0) {
    return <FileEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="space-y-4 rounded-lg bg-muted/50 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar archivos..."
              value={searchQuery}
            />
          </div>

          {/* Type Filter */}
          <Select
            onValueChange={(value) => setFilterType(value as FilterType)}
            value={filterType}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="images">Imágenes</SelectItem>
              <SelectItem value="documents">Documentos</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select
            onValueChange={(value) => setFilterDate(value as FilterDate)}
            value={filterDate}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier fecha</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            onValueChange={(value) => setSortBy(value as SortOption)}
            value={sortBy}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Más recientes primero</SelectItem>
              <SelectItem value="date-asc">Más antiguos primero</SelectItem>
              <SelectItem value="size-desc">Mayor tamaño primero</SelectItem>
              <SelectItem value="size-asc">Menor tamaño primero</SelectItem>
              <SelectItem value="name-asc">Nombre A-Z</SelectItem>
              <SelectItem value="name-desc">Nombre Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredFiles.length !== files.length && (
          <div className="text-muted-foreground text-sm">
            Mostrando {filteredFiles.length} de {files.length} archivos
          </div>
        )}
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No se encontraron archivos que coincidan con tus filtros
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <FileItem
              file={file}
              isDeleting={isDeleting && deletingFileId === file.id}
              key={file.id}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
