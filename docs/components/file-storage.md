# File Storage Component

## Overview

The File Storage feature is a complete file management system that allows users to upload, manage, and organize files directly within the application. It provides a user-friendly interface with drag-and-drop functionality, filtering, sorting, and file preview capabilities.

## Features

### Core Functionality

- **Drag and Drop Upload**: Intuitive drag-and-drop interface for uploading files
- **Multi-file Upload**: Support for simultaneous upload of multiple files
- **File Management**: Download and delete files with confirmation dialogs
- **Filtering**: Filter files by type (images, documents) and date range
- **Sorting**: Multiple sort options (date, size, name)
- **Search**: Full-text search for files by name
- **Image Preview**: Built-in image preview modal with lazy loading
- **File Information**: Display file size, upload date, and type information
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

### Validation

- **Size Limit**: Maximum 100MB per file
- **File Types**: Support for:
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF, Word, Excel, PowerPoint, TXT
- **Client-side Validation**: Immediate feedback on invalid files
- **Server-side Validation**: Prevents uploading invalid files to storage
- **Ownership Verification**: Users can only manage their own files

### User Experience

- **Real-time Feedback**: Toast notifications for all actions
- **Loading States**: Visual indicators during upload and deletion
- **Empty State**: Helpful guidance when no files exist
- **Error Handling**: Clear error messages with actionable suggestions
- **Optimistic UI**: Files appear immediately after selection
- **Accessibility**: Full keyboard navigation and ARIA labels

## Architecture

### Directory Structure

```
app/(dashboard)/tools/file-storage/
├── page.tsx                    # Main page (RSC)
├── actions.ts                  # Server actions
└── api/upload/route.ts         # Upload API route

components/tools/file-storage/
├── file-storage-container.tsx  # Main container component
├── file-upload-zone.tsx        # Drag-and-drop zone
├── file-list.tsx               # File list with filters
├── file-item.tsx               # Individual file item
├── file-type-icon.tsx          # File type icon component
└── file-empty-state.tsx        # Empty state component
```

### Data Flow

1. **Upload Flow**:
   ```
   User selects files → FileUploadZone validates → FormData created
   → POST /api/upload → Vercel Blob storage → Save to DB
   → Update file list → Show success toast
   ```

2. **Delete Flow**:
   ```
   User clicks delete → Confirmation dialog → deleteServerFile()
   → Delete from DB → Remove from UI → Show success toast
   ```

3. **List Flow**:
   ```
   Page loads → getServerFiles() → Initial files loaded
   → User filters/sorts → Client-side filtering in FileList
   ```

## Components

### FileStorageContainer
**Location**: `components/tools/file-storage/file-storage-container.tsx`

Main container component that manages the upload and file list state.

**Props**:
- `initialFiles: StoredFile[]` - Initial files from server

**State Management**:
- `files` - Current file list
- `isUploading` - Upload in progress flag
- `uploadProgress` - Progress per file
- `isDeleting` - Delete in progress flag
- `deletingFileId` - ID of file being deleted

### FileUploadZone
**Location**: `components/tools/file-storage/file-upload-zone.tsx`

Drag-and-drop zone for file selection.

**Props**:
```typescript
interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}
```

**Features**:
- Drag and drop detection
- Click to open file picker
- File validation
- Error display
- Keyboard accessible

### FileList
**Location**: `components/tools/file-storage/file-list.tsx`

File list with filtering, sorting, and search.

**Props**:
```typescript
interface FileListProps {
  files: StoredFile[];
  onDelete: (fileId: string) => Promise<void>;
  isDeleting?: boolean;
  deletingFileId?: string | null;
}
```

**Features**:
- Real-time search
- Type filtering (images/documents)
- Date range filtering (today/week/month)
- Sorting options
- Empty state handling

### FileItem
**Location**: `components/tools/file-storage/file-item.tsx`

Individual file item with preview and actions.

**Props**:
```typescript
interface FileItemProps {
  file: StoredFile;
  onDelete: (fileId: string) => Promise<void>;
  isDeleting?: boolean;
}
```

**Features**:
- File type icon
- Image thumbnail with preview modal
- Download functionality
- Delete with confirmation
- File metadata display

### FileTypeIcon
**Location**: `components/tools/file-storage/file-type-icon.tsx`

Displays appropriate icon for file type.

**Functions**:
- `FileTypeIcon` - Component for displaying file type icon
- `getFileTypeLabel` - Returns Spanish label for file type

## Server Actions

### getServerFiles
```typescript
export async function getServerFiles({
  limit = 50,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<StoredFile[]>
```

Fetches authenticated user's files with pagination.

### uploadServerFile
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

Saves file metadata to database after Vercel Blob upload.

### deleteServerFile
```typescript
export async function deleteServerFile({
  id,
}: {
  id: string;
}): Promise<StoredFile>
```

Deletes file and metadata from database.

## API Routes

### POST /api/upload
**Location**: `app/(dashboard)/tools/file-storage/api/upload/route.ts`

Handles file upload to Vercel Blob.

**Request**:
```
Content-Type: multipart/form-data
- file: File (max 100MB)
```

**Response**:
```json
{
  "url": "https://blob.vercelusercontent.com/...",
  "filename": "example.jpg",
  "size": 1024,
  "type": "image/jpeg"
}
```

**Validation**:
- File size ≤ 100MB
- MIME type in allowed list
- Authentication required

**Error Responses**:
- `400` - Invalid file or validation error
- `401` - Unauthorized
- `500` - Upload failed

## Database Schema

### StoredFile Table

```typescript
export const storedFile = pgTable(
  "StoredFile",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("userId").notNull().references(() => user.id),
    fileName: text("fileName").notNull(),
    fileSize: integer("fileSize").notNull(),
    fileType: text("fileType").notNull(),
    fileUrl: text("fileUrl").notNull(),
    uploadedAt: timestamp("uploadedAt").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("StoredFile_userId_idx").on(table.userId),
  })
);
```

## Utility Functions

### formatBytes
Converts bytes to human-readable format (B, KB, MB, GB).

```typescript
export function formatBytes(bytes: number): string
```

Example:
```typescript
formatBytes(1024) // "1.00 KB"
formatBytes(1048576) // "1.00 MB"
```

### formatDate
Formats date as relative time or date string.

```typescript
export function formatDate(date: Date): string
```

Example:
```typescript
formatDate(new Date()) // "Justo ahora"
formatDate(new Date(Date.now() - 3600000)) // "Hace 1 hora"
```

## Accessibility

### WCAG AA Compliance

- **Semantic HTML**: Proper use of `<button>`, `<input>`, `<dialog>`
- **ARIA Labels**: All interactive elements have labels
- **Keyboard Navigation**: Full keyboard access with visible focus
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Indicators**: Clear visual feedback on focused elements
- **Error Messages**: Associated with form inputs

### Keyboard Shortcuts

- `Enter` or `Space` on upload zone: Open file picker
- `Escape`: Close modals and dialogs
- `Tab`: Navigate between interactive elements
- `Shift+Tab`: Reverse navigation

## Performance Optimization

### Image Handling
- Lazy loading for image previews
- Next.js `Image` component for optimization
- Client-side preview loading state

### File List
- Client-side filtering and sorting (no server round trips)
- Memoized filtering with `useMemo`
- Callback optimization with `useCallback`

### Upload
- Parallel uploads for multiple files
- Streaming upload to Vercel Blob
- Progress tracking per file

## Error Handling

### Client-side Validation
```typescript
// File upload zone validates before sending
- File size check (≤ 100MB)
- MIME type check
- User-friendly error messages
```

### Server-side Validation
```typescript
// API route and server actions validate
- Authentication check
- File size verification
- Type whitelist verification
- Ownership verification on delete
```

### Error Recovery
- Toast notifications on error
- User-friendly error messages
- Error suggestions where applicable
- Graceful degradation

## Security Considerations

1. **Authentication**: All operations require authenticated session
2. **Authorization**: Users can only access their own files
3. **File Type Whitelist**: Only allowed MIME types accepted
4. **Size Limits**: Maximum 100MB per file
5. **URL Generation**: Using Vercel Blob's public access for served files
6. **Data Validation**: Comprehensive validation on client and server

## Configuration

### Allowed File Types
Located in `file-upload-zone.tsx` and `api/upload/route.ts`:

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
```

### Size Limits
- **Maximum per file**: 100MB
- **Storage**: Vercel Blob (unlimited by app)

### Pagination
- **Default limit**: 50 files per request
- **Offset**: Supports pagination if needed

## Future Enhancements

1. **Sharing**: Share files with other users
2. **Folders**: Organize files into folders
3. **Tags**: Tag files for better organization
4. **Storage Quotas**: Limit per-user storage
5. **Encryption**: End-to-end encryption for sensitive files
6. **Versioning**: Keep file version history
7. **Batch Operations**: Select multiple files for bulk actions
8. **Advanced Preview**: Preview PDFs, documents, etc.

## Related Documentation

- [Database Schema](../database/)
- [API Documentation](../api/)
- [Authentication](../security/authentication.md)
- [UI Components](./shadcn-ui.md)

## Troubleshooting

### File upload fails
- Check file size (max 100MB)
- Verify file type is allowed
- Check internet connection
- Ensure authenticated session

### Preview not loading
- Check CORS settings on Vercel Blob
- Verify image URL is accessible
- Try refreshing page

### Delete not working
- Verify file ownership
- Check authentication session
- Try refreshing file list
