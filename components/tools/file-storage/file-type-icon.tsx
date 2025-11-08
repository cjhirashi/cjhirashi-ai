import {
  File,
  FileArchiveIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Music2Icon,
  Video2Icon,
} from "lucide-react";

interface FileTypeIconProps {
  mimeType: string;
  className?: string;
}

export function FileTypeIcon({
  mimeType,
  className = "h-5 w-5",
}: FileTypeIconProps) {
  // Image types
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className={className} />;
  }

  // Video types
  if (mimeType.startsWith("video/")) {
    return <Video2Icon className={className} />;
  }

  // Audio types
  if (mimeType.startsWith("audio/")) {
    return <Music2Icon className={className} />;
  }

  // PDF
  if (mimeType === "application/pdf") {
    return <FileTextIcon className={className} />;
  }

  // Word documents
  if (
    mimeType === "application/msword" ||
    mimeType.includes("wordprocessingml")
  ) {
    return <FileTextIcon className={className} />;
  }

  // Excel spreadsheets
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType.includes("spreadsheetml")
  ) {
    return <FileIcon className={className} />;
  }

  // PowerPoint presentations
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType.includes("presentationml")
  ) {
    return <FileIcon className={className} />;
  }

  // Compressed files
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/x-7z-compressed"
  ) {
    return <FileArchiveIcon className={className} />;
  }

  // Text files
  if (mimeType === "text/plain" || mimeType.startsWith("text/")) {
    return <FileTextIcon className={className} />;
  }

  // Default icon
  return <File className={className} />;
}

export function getFileTypeLabel(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Imagen";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType === "application/pdf") return "PDF";
  if (
    mimeType === "application/msword" ||
    mimeType.includes("wordprocessingml")
  )
    return "Documento";
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType.includes("spreadsheetml")
  )
    return "Hoja de cálculo";
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType.includes("presentationml")
  )
    return "Presentación";
  if (mimeType === "text/plain" || mimeType.startsWith("text/")) return "Texto";
  return "Archivo";
}
