# File Storage Implementation Guide

## Overview

This guide explains how the File Storage feature was implemented and how to extend or maintain it.

## Architecture Decisions

### Why Vercel Blob for Storage?
- **Native Integration**: Seamless integration with Next.js and Vercel
- **Managed Service**: No infrastructure to manage
- **Performance**: CDN-backed for fast file serving
- **Reliability**: Enterprise-grade storage with SLA
- **Cost**: Pay-as-you-go, no minimum costs

### Why Server Actions for Database Operations?
- **Type Safety**: Full TypeScript support with no runtime errors
- **Security**: Server-side only, client cannot bypass auth
- **Simplicity**: No API route boilerplate needed
- **Performance**: Reduced round trips compared to API routes

### Why Pagination-Ready Architecture?
- **Scalability**: Supports growing file collections
- **Performance**: Doesn't load all files into memory
- **UX**: Can implement lazy loading if needed

## Component Hierarchy

```
FileStoragePage (RSC)
├── getServerFiles()
└── FileStorageContainer (Client)
    ├── FileUploadZone
    │   └── File selection and validation
    └── FileList
        ├── Filters and search
        └── FileItem (repeated)
            ├── Thumbnail/Icon
            ├── Metadata
            └── Actions
```

## Data Flow

### Upload Flow

```
User selects file
    ↓
FileUploadZone validates
    ├─ Size check (≤ 100MB)
    └─ MIME type check
    ↓
FormData sent to /api/upload
    ↓
API validates and uploads to Vercel Blob
    ├─ Authentication check
    ├─ Size verification
    ├─ Type whitelist verification
    └─ Generates unique filename with user ID
    ↓
Returns: { url, filename, size, type }
    ↓
uploadServerFile() saves to database
    ├─ Verifies all fields
    ├─ Associates with current user
    └─ Returns StoredFile record
    ↓
FileStorageContainer updates state
    ↓
FileList re-renders with new file
    ↓
Success toast displayed
```

### Delete Flow

```
User clicks delete button
    ↓
FileItem shows confirmation dialog
    ↓
deleteServerFile() called with file ID
    ├─ Verifies authentication
    ├─ Loads file from database
    ├─ Verifies user ownership
    └─ Deletes from database
    ↓
FileStorageContainer removes from state
    ↓
FileList re-renders
    ↓
Success toast displayed
```

### Filter/Sort Flow

```
User changes filters/sort
    ↓
State updated in FileList
    ↓
useMemo recalculates filtered array
    ├─ Search filter
    ├─ Type filter (images/documents)
    ├─ Date range filter
    └─ Sort by selected option
    ↓
Component re-renders with filtered results
```

## Security Implementation

### Authentication
- All operations protected by Next.js middleware
- Session checked on every server action
- API routes verify session before processing

### Authorization
- Users can only access their own files
- Ownership verified on delete operations
- File URLs are public (user's choice)

### File Validation
- **Client-side**: Immediate feedback, prevents unnecessary uploads
- **Server-side**: Cannot be bypassed by client manipulation

```typescript
// Validation happens in two places
1. FileUploadZone (client)
   - Size check
   - MIME type check

2. API route and server actions (server)
   - All checks repeated
   - Cannot trust client
```

### Input Sanitization
- Filenames sanitized by Vercel Blob
- MIME types validated against whitelist
- File paths generated server-side with user ID

## Performance Optimizations

### Image Handling
```typescript
// Next.js Image component for optimization
<Image
  src={file.fileUrl}
  alt={file.fileName}
  width={800}
  height={600}
  className="w-full h-auto"
/>
```
Benefits:
- Automatic format optimization (WebP, etc.)
- Responsive image sizing
- Lazy loading out of box

### Memoization
```typescript
// Prevent unnecessary recalculations
const filteredFiles = useMemo(() => {
  // Complex filtering logic
}, [files, searchQuery, sortBy, filterType, filterDate]);
```

### Callback Optimization
```typescript
// Prevent function recreation on every render
const handleDelete = useCallback(
  async (fileId: string) => {
    // Delete logic
  },
  [toast] // Only recreate if dependencies change
);
```

### File Upload
```typescript
// Parallel uploads for multiple files
const uploadPromises = selectedFiles.map(async (file) => {
  // Upload each file independently
});
const results = await Promise.all(uploadPromises);
```

## Error Handling Strategy

### Three-Tier Error Handling

```typescript
1. Client-side validation
   └─ Immediate feedback before server call

2. API/Server validation
   └─ Security checks, cannot be bypassed

3. Error recovery
   └─ Toast notifications with actionable suggestions
```

### Error Types

| Type | Example | Recovery |
|------|---------|----------|
| **Validation** | File too large | Show limit, allow retry |
| **Auth** | Not logged in | Redirect to login |
| **Not Found** | File deleted | Remove from list |
| **Server** | Database error | Suggest retry |

## Testing Approach

### Unit Testing Components
```typescript
// Test FileUploadZone
describe("FileUploadZone", () => {
  it("validates file size", () => {
    const oversizedFile = new File(["x".repeat(101 * 1024 * 1024)], "big.txt");
    // Assert error shown
  });
});
```

### Integration Testing
```typescript
// Test complete upload flow
describe("File upload", () => {
  it("uploads file and saves metadata", async () => {
    // Select file
    // Verify API called
    // Verify database saved
    // Verify UI updated
  });
});
```

### E2E Testing
```typescript
// Full user journey with Playwright
test("user can upload and download file", async ({ page }) => {
  await page.goto("/dashboard/tools/file-storage");
  await page.fill('input[type="file"]', "path/to/file.pdf");
  await page.waitForSelector("button:has-text('Download')");
});
```

## Extending the Feature

### Add File Sharing
```typescript
// 1. Add shared_with column to StoredFile
// 2. Create ShareFile server action
// 3. Update FileItem with share button
// 4. Create sharing UI (emails, links, permissions)
```

### Add Folders
```typescript
// 1. Create Folder table
// 2. Add parentFolderId to StoredFile
// 3. Update FileList to show folders
// 4. Add folder navigation
```

### Add Tags
```typescript
// 1. Create Tag table
// 2. Create FileTag junction table
// 3. Update FileItem with tag display
// 4. Add tag filtering to FileList
```

### Add Version History
```typescript
// 1. Create FileVersion table
// 2. Track uploads with version numbers
// 3. Allow reverting to previous versions
// 4. Show version history in UI
```

### Add Encryption
```typescript
// 1. Encrypt file before uploading to Blob
// 2. Store encryption key in database
// 3. Decrypt when serving file
// 4. Update API to handle encrypted files
```

## Configuration Options

### Adjustable Limits

```typescript
// In file-upload-zone.tsx and api/upload/route.ts
const MAX_FILE_SIZE = 100 * 1024 * 1024; // Change here

// In actions.ts
export async function getServerFiles({
  limit = 50, // Change default limit
  // ...
})
```

### Allowed File Types

```typescript
// In ALLOWED_MIME_TYPES array
const ALLOWED_MIME_TYPES = [
  // Add or remove MIME types
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // "application/zip", // Add to support ZIP
];
```

### Localization

```typescript
// UI text is in Spanish, translate strings:
// "Arrastra archivos aquí..." → "Drag files here..."
// Update all aria-labels and messages for your language
```

## Monitoring and Analytics

### What to Track
```typescript
// Log in FileStorageContainer
console.log({
  event: "file_uploaded",
  fileSize: file.fileSize,
  fileType: file.fileType,
  uploadTime: Date.now() - startTime,
});
```

### Database Queries to Monitor
```sql
-- Count total files
SELECT COUNT(*) FROM "StoredFile" WHERE "userId" = $1;

-- Find largest files
SELECT * FROM "StoredFile" WHERE "userId" = $1
ORDER BY "fileSize" DESC LIMIT 10;

-- Track storage per user
SELECT "userId", SUM("fileSize") as total_storage
FROM "StoredFile" GROUP BY "userId";
```

### Potential Issues
- Files uploaded but metadata not saved (handle with retry)
- Orphaned files in Blob (implement cleanup job)
- Large file uploads timing out (implement chunked upload)

## Deployment Checklist

- [ ] BLOB_READ_WRITE_TOKEN environment variable set
- [ ] Database migration applied (StoredFile table exists)
- [ ] File size limits are appropriate for your use case
- [ ] Allowed MIME types configured correctly
- [ ] Error handling tested on staging
- [ ] File preview works for image types
- [ ] Download functionality tested
- [ ] Delete with confirmation works
- [ ] Search/filter responsive to user input
- [ ] Responsive design tested on mobile
- [ ] Accessibility tested with screen reader
- [ ] Performance acceptable (<3s upload for 10MB file)

## Troubleshooting

### Files upload but don't appear in list
```typescript
// Check:
// 1. uploadServerFile() succeeded (check database)
// 2. FileStorageContainer state updated
// 3. API response returned properly
// 4. No JavaScript errors in console
```

### Images don't preview
```typescript
// Check:
// 1. File URL is accessible (paste in browser)
// 2. CORS headers correct (check Network tab)
// 3. Image MIME type supported
// 4. Image loading state shows
```

### Delete button doesn't work
```typescript
// Check:
// 1. File is owned by current user
// 2. Session is valid
// 3. File ID is correct
// 4. Database still has the file
// 5. No JavaScript errors
```

### Upload fails with size error
```typescript
// Check:
// 1. File actually < 100MB
// 2. Both client and server size limit match
// 3. Browser isn't double-counting (check Network tab)
// 4. Vercel Blob size limit not hit
```

## Performance Benchmarks

### Expected Performance
| Operation | Time | Notes |
|-----------|------|-------|
| List files | <100ms | Client-side sorting/filtering |
| Upload 1MB | <2s | Depends on connection |
| Upload 100MB | <30s | Chunked by Vercel Blob |
| Delete file | <500ms | Database operation |
| Search/filter | <50ms | Client-side memoized |

### Optimization Tips
1. Use lazy loading for large file lists
2. Implement pagination (default 50 per page)
3. Cache file metadata with SWR
4. Compress images before upload
5. Use progressive image placeholders

## Related Files

```
Core Implementation:
- app/(dashboard)/tools/file-storage/page.tsx
- app/(dashboard)/tools/file-storage/actions.ts
- app/(dashboard)/tools/file-storage/api/upload/route.ts

Components:
- components/tools/file-storage/file-storage-container.tsx
- components/tools/file-storage/file-upload-zone.tsx
- components/tools/file-storage/file-list.tsx
- components/tools/file-storage/file-item.tsx
- components/tools/file-storage/file-type-icon.tsx
- components/tools/file-storage/file-empty-state.tsx

Database:
- lib/db/schema.ts (StoredFile table)
- lib/db/queries.ts (File queries)

Utilities:
- lib/utils.ts (formatBytes, formatDate)
```

## References

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
