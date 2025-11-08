# File Storage API Documentation

## Overview

The File Storage API provides endpoints for uploading, managing, and retrieving user files. All endpoints require authentication and operate with Vercel Blob storage for file persistence.

## Authentication

All endpoints require a valid authentication session. If not authenticated, requests will return `401 Unauthorized`.

```bash
# Check session in request
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Endpoints

### POST /dashboard/tools/file-storage/api/upload

Uploads a file to Vercel Blob storage and returns file metadata.

#### Request

**Method**: POST
**Content-Type**: multipart/form-data
**Authentication**: Required

**Body Parameters**:
- `file` (File, required): File to upload
  - Maximum size: 100MB
  - Allowed MIME types: images (JPEG, PNG, GIF, WebP), documents (PDF, Word, Excel, PowerPoint, TXT)

#### Request Example

```bash
curl -X POST http://localhost:3000/dashboard/tools/file-storage/api/upload \
  -H "Cookie: <auth-session>" \
  -F "file=@document.pdf"
```

#### Response

**Status**: 200 OK

```json
{
  "url": "https://blob.vercelusercontent.com/user-id/1234567890-document.pdf",
  "filename": "document.pdf",
  "size": 1048576,
  "type": "application/pdf"
}
```

#### Error Responses

**400 Bad Request** - Invalid file or validation error
```json
{
  "error": "File size should be less than 100MB, File type is not allowed"
}
```

**401 Unauthorized** - Not authenticated
```json
{
  "error": "Unauthorized"
}
```

**400 Empty Body**
```json
{
  "error": "Request body is empty"
}
```

**400 No File**
```json
{
  "error": "No file uploaded"
}
```

**500 Upload Failed**
```json
{
  "error": "Upload to storage failed"
}
```

#### Validation Rules

| Rule | Details |
|------|---------|
| **File Size** | Maximum 100MB (104,857,600 bytes) |
| **File Type** | Must be in ALLOWED_MIME_TYPES whitelist |
| **Authentication** | User session required |
| **Content-Type** | multipart/form-data |

#### Allowed MIME Types

```
Images:
- image/jpeg
- image/png
- image/gif
- image/webp

Documents:
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document
- text/plain
- application/vnd.ms-excel
- application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- application/vnd.ms-powerpoint
- application/vnd.openxmlformats-officedocument.presentationml.presentation
```

## Server Actions

Server actions provide type-safe, authenticated operations for file management.

### getServerFiles

Retrieves paginated list of authenticated user's files.

```typescript
export async function getServerFiles({
  limit = 50,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<StoredFile[]>
```

**Parameters**:
- `limit` (number, optional): Maximum files to return (default: 50)
- `offset` (number, optional): Number of files to skip (default: 0)

**Returns**: `Promise<StoredFile[]>`

**Throws**:
- `ChatSDKError` - "unauthorized:database" if not authenticated
- `ChatSDKError` - "bad_request:database" if query fails

**Example**:
```typescript
import { getServerFiles } from "@/app/(dashboard)/tools/file-storage/actions";

const files = await getServerFiles({ limit: 25, offset: 0 });
```

### uploadServerFile

Saves file metadata to database after successful Blob upload.

```typescript
export async function uploadServerFile({
  fileName,
  fileSize,
  fileType,
  fileUrl,
}: {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}): Promise<StoredFile>
```

**Parameters**:
- `fileName` (string, required): Original filename
- `fileSize` (number, required): File size in bytes
- `fileType` (string, required): MIME type
- `fileUrl` (string, required): URL from Vercel Blob

**Returns**: `Promise<StoredFile>` - Saved file record

**Validation**:
- fileName must not be empty
- fileSize must be > 0
- fileUrl must not be empty

**Throws**:
- `ChatSDKError` - "unauthorized:database" if not authenticated
- `ChatSDKError` - "bad_request:api" if validation fails
- `ChatSDKError` - "bad_request:database" if save fails

**Example**:
```typescript
const file = await uploadServerFile({
  fileName: "document.pdf",
  fileSize: 1048576,
  fileType: "application/pdf",
  fileUrl: "https://blob.vercelusercontent.com/...",
});
```

### deleteServerFile

Deletes a file and its metadata from the database.

```typescript
export async function deleteServerFile({
  id,
}: {
  id: string;
}): Promise<StoredFile>
```

**Parameters**:
- `id` (string, required): File ID to delete

**Returns**: `Promise<StoredFile>` - Deleted file record

**Security**:
- Verifies file ownership (user can only delete own files)
- Requires authentication

**Throws**:
- `ChatSDKError` - "unauthorized:database" if not authenticated
- `ChatSDKError` - "bad_request:database" if file not found
- `ChatSDKError` - "unauthorized:database" if not owner
- `ChatSDKError` - "bad_request:database" if delete fails

**Example**:
```typescript
await deleteServerFile({ id: "550e8400-e29b-41d4-a716-446655440000" });
```

## Data Models

### StoredFile

```typescript
interface StoredFile {
  id: string;              // UUID
  userId: string;          // UUID of file owner
  fileName: string;        // Original filename
  fileSize: number;        // Size in bytes
  fileType: string;        // MIME type
  fileUrl: string;         // Vercel Blob URL
  uploadedAt: Date;        // Upload timestamp
}
```

**Database Table**: `StoredFile`

**Primary Key**: `id`

**Indexes**:
- `StoredFile_userId_idx` on `userId` for efficient user file queries

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `unauthorized:database` | 401 | User not authenticated |
| `bad_request:api` | 400 | Invalid input parameters |
| `bad_request:database` | 400 | Database operation failed |

## Rate Limiting

Currently no rate limits on file storage operations. Consider implementing:
- Max files per user
- Max storage per user
- Max upload size per day

## CORS Policies

File URLs from Vercel Blob are publicly accessible. CORS headers are set by Vercel.

## Changelog

### Version 1.0.0
- Initial implementation
- Support for images and document uploads
- File listing, download, and deletion
- Filtering and sorting capabilities
- Image preview support

## Examples

### Complete Upload Flow

```typescript
// 1. Client selects file
const file = fileInput.files[0];

// 2. Upload to API
const formData = new FormData();
formData.append("file", file);

const uploadResponse = await fetch(
  "/dashboard/tools/file-storage/api/upload",
  { method: "POST", body: formData }
);

const uploadedData = await uploadResponse.json();

// 3. Save metadata to database
const savedFile = await uploadServerFile({
  fileName: uploadedData.filename,
  fileSize: uploadedData.size,
  fileType: uploadedData.type,
  fileUrl: uploadedData.url,
});

// 4. Use file
console.log(`File saved with ID: ${savedFile.id}`);
```

### List and Filter Files

```typescript
// Get all files
const files = await getServerFiles();

// Get first 10 files
const paginated = await getServerFiles({ limit: 10, offset: 0 });

// Filter on client
const images = files.filter(f => f.fileType.startsWith("image/"));
const byDate = files.sort((a, b) =>
  new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
);
```

### Handle Errors

```typescript
try {
  await deleteServerFile({ id: fileId });
} catch (error) {
  if (error instanceof ChatSDKError) {
    if (error.code === "unauthorized:database") {
      console.error("You don't own this file");
    } else if (error.code === "bad_request:database") {
      console.error("File not found or already deleted");
    }
  }
}
```

## Testing

### Mock API Responses

For testing without Vercel Blob:

```typescript
// Mock POST upload
global.fetch = jest.fn((url) => {
  if (url.includes("/api/upload")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        url: "https://example.com/file.pdf",
        filename: "file.pdf",
        size: 1024,
        type: "application/pdf",
      }),
    });
  }
  return Promise.reject(new Error("Not found"));
});
```

## Integration with Frontend

### React Component Example

```typescript
"use client";

import { useState } from "react";
import {
  uploadServerFile,
  deleteServerFile,
  getServerFiles,
} from "@/app/(dashboard)/tools/file-storage/actions";

export function FileManager() {
  const [files, setFiles] = useState([]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const savedFile = await uploadServerFile({
      fileName: data.filename,
      fileSize: data.size,
      fileType: data.type,
      fileUrl: data.url,
    });

    setFiles([...files, savedFile]);
  };

  const handleDelete = async (id: string) => {
    await deleteServerFile({ id });
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div>
      {/* UI implementation */}
    </div>
  );
}
```

## Related Documentation

- [File Storage Component](../components/file-storage.md)
- [Database Schema](../database/)
- [Authentication](../security/authentication.md)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
