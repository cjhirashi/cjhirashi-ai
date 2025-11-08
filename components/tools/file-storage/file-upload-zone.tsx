"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export function FileUploadZone({
  onFilesSelected,
  isLoading = false,
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: FileList): File[] => {
    setError(null);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // biome-ignore lint: Use 'for' loops instead of 'forEach'
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} supera el tamaño máximo de 100MB`);
        // biome-ignore lint: Continue statement
        continue;
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        errors.push(`${file.name} no es un tipo de archivo permitido`);
        // biome-ignore lint: Continue statement
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setError(errors.join("; "));
    }

    return validFiles;
  }, []);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || isLoading) return;

      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragActive(true);
      } else if (e.type === "dragleave") {
        setIsDragActive(false);
      }
    },
    [disabled, isLoading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled || isLoading) return;

      const files = e.dataTransfer.files;
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [disabled, isLoading, onFilesSelected, validateFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (!files) return;

      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFilesSelected, validateFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isLoading]);

  return (
    <div className="space-y-2">
      <div
        aria-label="Upload files by clicking or dragging"
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive && !disabled && !isLoading
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 bg-muted/25",
          disabled || isLoading ? "cursor-not-allowed opacity-50" : ""
        )}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <input
          accept={ALLOWED_MIME_TYPES.join(",")}
          aria-hidden="true"
          className="hidden"
          disabled={disabled || isLoading}
          multiple
          onChange={handleChange}
          ref={fileInputRef}
          type="file"
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <div>
            <p className="font-semibold">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="mt-1 text-muted-foreground text-sm">
              Máximo 100MB por archivo (imágenes, documentos, etc.)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
