"use client";

import { useCallback, useState } from "react";
import {
  deleteServerFile,
  uploadServerFile,
} from "@/app/(dashboard)/tools/file-storage/actions";
import { useToast } from "@/hooks/use-toast";
import type { StoredFile } from "@/lib/db/schema";
import { FileList } from "./file-list";
import { FileUploadZone } from "./file-upload-zone";

interface FileStorageContainerProps {
  readonly initialFiles: StoredFile[];
}

export function FileStorageContainer({
  initialFiles,
}: FileStorageContainerProps) {
  const [files, setFiles] = useState<StoredFile[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = useCallback(
    async (selectedFiles: File[]) => {
      setIsUploading(true);
      setUploadProgress({});

      const uploadPromises = selectedFiles.map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`;

        try {
          // Upload file to Vercel Blob
          const formData = new FormData();
          formData.append("file", file);

          const uploadResponse = await fetch(
            "/dashboard/tools/file-storage/api/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload file");
          }

          const uploadedFile = await uploadResponse.json();

          // Save file metadata to database
          const savedFile = await uploadServerFile({
            fileName: uploadedFile.filename,
            fileSize: uploadedFile.size,
            fileType: uploadedFile.type,
            fileUrl: uploadedFile.url,
          });

          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: 100,
          }));

          return savedFile;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error uploading file";
          throw new Error(errorMessage);
        }
      });

      try {
        const uploadedFiles = await Promise.all(uploadPromises);

        // Update files list
        setFiles((prev) => [...uploadedFiles, ...prev]);

        // Show success message
        const count = uploadedFiles.length;
        toast({
          title: "Éxito",
          description:
            count === 1
              ? "Archivo subido correctamente"
              : `${count} archivos subidos correctamente`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error uploading files";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    [toast]
  );

  const handleDeleteFile = useCallback(
    async (fileId: string) => {
      setIsDeleting(true);
      setDeletingFileId(fileId);

      try {
        await deleteServerFile({ id: fileId });

        // Update files list
        setFiles((prev) => prev.filter((f) => f.id !== fileId));

        toast({
          title: "Éxito",
          description: "Archivo eliminado correctamente",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error deleting file";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setDeletingFileId(null);
      }
    },
    [toast]
  );

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Subir Archivos</h2>
        <FileUploadZone
          disabled={isDeleting}
          isLoading={isUploading}
          onFilesSelected={handleFilesSelected}
        />
      </div>

      {/* Files List Section */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Mis Archivos</h2>
        <FileList
          deletingFileId={deletingFileId}
          files={files}
          isDeleting={isDeleting}
          onDelete={handleDeleteFile}
        />
      </div>
    </div>
  );
}
