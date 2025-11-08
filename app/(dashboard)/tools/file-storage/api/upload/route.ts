import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed file types with MIME types
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
      message: "File type is not allowed. Please upload an image or document.",
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return NextResponse.json(
      { error: "Request body is empty" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData
    const fileObject = formData.get("file") as File;
    const filename = fileObject.name;

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFilename = `${session.user.id}/${timestamp}-${filename}`;

    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(uniqueFilename, fileBuffer, {
        access: "public",
      });

      return NextResponse.json({
        filename,
        size: file.size,
        type: file.type,
        url: data.url,
      });
    } catch (_error) {
      return NextResponse.json(
        { error: "Upload to storage failed" },
        { status: 500 }
      );
    }
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
