"use client";

import { Download, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StoredFile } from "@/lib/db/schema";
import { formatBytes, formatDate } from "@/lib/utils";
import { FileTypeIcon, getFileTypeLabel } from "./file-type-icon";

interface FileItemProps {
  file: StoredFile;
  onDelete: (fileId: string) => Promise<void>;
  isDeleting?: boolean;
}

export function FileItem({
  file,
  onDelete,
  isDeleting = false,
}: FileItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const isImage = file.fileType.startsWith("image/");

  const handleDelete = async () => {
    try {
      await onDelete(file.id);
      setShowDeleteDialog(false);
    } catch (error) {
      // Error handling is done in parent component
      console.error(error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.fileUrl;
    link.download = file.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
        {/* File Icon or Thumbnail */}
        <div className="flex-shrink-0">
          {isImage ? (
            <button
              aria-label={`Preview ${file.fileName}`}
              className="group relative h-12 w-12 cursor-pointer overflow-hidden rounded"
              onClick={() => setShowPreview(true)}
              type="button"
            >
              <Image
                alt={file.fileName}
                className="object-cover transition-transform group-hover:scale-110"
                fill
                src={file.fileUrl}
              />
            </button>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
              <FileTypeIcon className="h-6 w-6" mimeType={file.fileType} />
            </div>
          )}
        </div>

        {/* File Information */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm">{file.fileName}</p>
          <div className="mt-1 flex flex-col gap-1 text-muted-foreground text-xs">
            <p>{formatBytes(file.fileSize)}</p>
            <p>{formatDate(file.uploadedAt)}</p>
            <p>{getFileTypeLabel(file.fileType)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 gap-2">
          <Button
            aria-label={`Download ${file.fileName}`}
            disabled={isDeleting}
            onClick={handleDownload}
            size="icon"
            title="Descargar"
            variant="ghost"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            aria-label={`Delete ${file.fileName}`}
            disabled={isDeleting}
            onClick={() => setShowDeleteDialog(true)}
            size="icon"
            title="Eliminar"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar archivo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{file.fileName}&quot;?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Dialog */}
      {isImage && (
        <Dialog onOpenChange={setShowPreview} open={showPreview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{file.fileName}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full bg-muted">
              {isPreviewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-primary" />
                </div>
              )}
              <Image
                alt={file.fileName}
                className="h-auto w-full rounded-lg"
                height={600}
                onLoadingComplete={() => setIsPreviewLoading(false)}
                src={file.fileUrl}
                width={800}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
