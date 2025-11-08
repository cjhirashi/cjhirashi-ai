# TODO List Component Documentation

## Overview

The TODO List is a complete task management feature for the dashboard. It allows users to create, read, update, delete, and organize their tasks with support for filtering, sorting, and prioritization.

**Location:** `/app/(dashboard)/tools/todo-list/`

## Features

### Core Functionality
- **Create tasks** with title, description, priority, and due date
- **Mark tasks** as completed or pending
- **Edit tasks** to update any field
- **Delete tasks** with confirmation dialog
- **Filter tasks** by status (all, pending, completed)
- **Filter tasks** by priority (low, medium, high)
- **Sort tasks** by:
  - Priority (high to low)
  - Due date (ascending)
  - Creation date (descending)

### User Experience
- **Optimistic UI updates** - Task actions update immediately before server confirmation
- **Empty states** - Helpful messages for different filter combinations
- **Toast notifications** - Clear feedback for all actions
- **Overdue highlighting** - Tasks past their due date shown in red
- **Responsive design** - Mobile-first approach works on all devices
- **Accessibility** - Full keyboard navigation and ARIA labels

### Status Indicators
- **Priority badges**: Color-coded (Low=Blue, Medium=Yellow, High=Red)
- **Due date display**:
  - "Hoy" (Today) in orange
  - "Mañana" (Tomorrow) in orange
  - Past dates in red (overdue)
  - Future dates in gray

## Architecture

### File Structure

```
app/(dashboard)/tools/todo-list/
├── page.tsx              # Main page component (RSC)
└── actions.ts            # Server actions for data mutations

components/tools/todo-list/
├── priority-badge.tsx    # Priority display component
├── todo-form.tsx         # Form for create/edit
├── todo-item.tsx         # Individual task item
├── todo-list.tsx         # List with filtering/sorting
├── todo-filters.tsx      # Filter controls
├── todo-empty-state.tsx  # Empty state display
└── todo-container.tsx    # Main client-side container

hooks/
└── use-toast.ts          # Toast notification hook

components/ui/
└── checkbox.tsx          # Custom checkbox component
```

### Data Flow

```
page.tsx (RSC)
  ↓
TodoContainer (Client)
  ├→ TodoForm (Create/Edit)
  ├→ TodoFilters (Filter Controls)
  └→ TodoList (Display)
      ├→ TodoItem (Individual task)
      └→ TodoEmptyState (No results)
```

### Server Actions

Located in `app/(dashboard)/tools/todo-list/actions.ts`:

- **`getServerTodos()`** - Fetch user's tasks with optional filters
- **`createServerTodo()`** - Create new task
- **`updateServerTodo()`** - Update existing task
- **`deleteServerTodo()`** - Delete task (with ownership verification)

All server actions:
1. Check authentication via `auth()`
2. Verify user session
3. Call database functions from `lib/db/queries`
4. Handle errors with `ChatSDKError`

### Database Schema

Uses existing `TodoItem` table in PostgreSQL:

```typescript
{
  id: UUID (primary key)
  userId: UUID (foreign key to User)
  title: string (required)
  description?: string
  completed: boolean (default: false)
  priority: enum("low", "medium", "high") (default: "medium")
  dueDate?: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Component Props

### TodoContainer

**Main container component** - manages state and server actions

```typescript
interface TodoContainerProps {
  initialTodos: TodoItem[]
  onRefresh: () => Promise<void>
}
```

**State managed:**
- filterStatus: "all" | "pending" | "completed"
- filterPriority: "all" | "low" | "medium" | "high"
- sortBy: "priority" | "dueDate" | "createdAt"
- isFormLoading: boolean
- editingTodo: TodoItem | null
- showForm: boolean

### TodoForm

**Create/Edit task form component**

```typescript
interface TodoFormProps {
  onSubmit: (data: CreateTodoData) => Promise<void>
  isLoading?: boolean
  initialData?: Partial<TodoItem>
  isEditing?: boolean
}
```

**Features:**
- Title input (required)
- Description textarea (optional)
- Priority select (Low/Medium/High)
- Due date input (optional)
- Auto-resets after successful create
- Retains values during edit mode

### TodoList

**Task list with filtering and sorting**

```typescript
interface TodoListProps {
  initialTodos: TodoItem[]
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit: (todo: TodoItem) => void
  filterStatus: "all" | "pending" | "completed"
  filterPriority: "all" | "low" | "medium" | "high"
  sortBy: "priority" | "dueDate" | "createdAt"
}
```

**Handles:**
- Filtering by status and priority
- Sorting by different criteria
- Optimistic UI updates
- Delete confirmation dialog
- Empty state messages

### TodoItem

**Individual task display**

```typescript
interface TodoItemProps {
  todo: TodoItem
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (todo: TodoItem) => void
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}
```

**Visual features:**
- Checkbox for completion
- Title with strikethrough when completed
- Optional description
- Priority badge
- Due date with smart formatting
- Edit/delete buttons

### TodoFilters

**Filter and sort controls**

```typescript
interface TodoFiltersProps {
  filterStatus: FilterStatus
  filterPriority: FilterPriority
  sortBy: SortBy
  onFilterStatusChange: (status: FilterStatus) => void
  onFilterPriorityChange: (priority: FilterPriority) => void
  onSortByChange: (sort: SortBy) => void
}
```

## Usage Example

```typescript
// Page automatically loads todos and passes to container
export default async function TodoListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const initialTodos = await getServerTodos();

  return (
    <TodoContainer
      initialTodos={initialTodos}
      onRefresh={getServerTodos}
    />
  );
}
```

## Styling

### Tailwind CSS Classes
- Uses utility-first approach with Tailwind CSS 4
- Responsive breakpoints:
  - Mobile-first baseline
  - `sm:` for small devices (640px+)
  - Grid layouts adapt from 1 to 2 columns

### Color Scheme
- **Priority Low:** Blue (`bg-blue-100`, `text-blue-800`)
- **Priority Medium:** Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Priority High:** Red (`bg-red-100`, `text-red-800`)
- **Overdue:** Red (`bg-red-50`, `border-red-200`)
- **Today:** Orange (`bg-orange-100`)

## Accessibility

### WCAG AA Compliance

- **Semantic HTML:**
  - Form elements use proper `<label>` with `htmlFor`
  - Buttons have clear labels
  - Checkboxes properly associated with labels

- **Keyboard Navigation:**
  - All controls accessible via Tab key
  - Buttons and links keyboard-clickable
  - Focus indicators visible on all interactive elements

- **Screen Readers:**
  - ARIA labels for icon-only buttons
  - Descriptive form field labels
  - Status messages announced via toast notifications

- **Color Contrast:**
  - All text meets WCAG AA minimum (4.5:1)
  - Not relying on color alone for information (badges + dates)

### Aria Attributes
- `aria-label` on icon buttons (edit, delete)
- `aria-required="true"` on required form fields
- Form labels associated via `htmlFor`

## Error Handling

### Server Actions
- Validation in server actions (required title check)
- Ownership verification (can only modify own tasks)
- `ChatSDKError` for consistent error handling
- Try-catch blocks with meaningful error messages

### Client-Side
- Optimistic updates with fallback to initial state on error
- Toast notifications showing error messages
- Loading states prevent duplicate submissions
- Delete confirmation prevents accidental deletion

## Performance Optimizations

### Client-Side
- `useCallback` for memoized event handlers
- `useState` for local UI state
- No external state library (uses React hooks)
- Efficient filtering/sorting in `useMemo`

### Server-Side
- Database index on `(userId, completed)` for fast queries
- Pagination support (limit/offset) for future scaling
- Efficient type inference from Drizzle schema

### UI/UX
- Immediate optimistic updates (no wait for server)
- Toast notifications for quick feedback
- Responsive images and lazy-loaded components
- Smooth animations with CSS transitions

## Testing Considerations

### Test Scenarios
1. Create task with all fields, minimal fields
2. Edit task and verify updates
3. Delete task with confirmation
4. Filter by status (all, pending, completed)
5. Filter by priority (all priorities)
6. Sort by different criteria
7. Mark task complete/incomplete
8. Display overdue tasks correctly
9. Mobile/tablet responsive layout
10. Keyboard navigation

### Example Test
```typescript
test("should create task and display in list", async () => {
  // 1. Fill form
  // 2. Submit
  // 3. Verify toast notification
  // 4. Verify task appears in list
  // 5. Verify list refreshes
})
```

## Future Enhancements

- Recurring tasks
- Task due time (not just date)
- Categories/tags for tasks
- Task subtasks/checklists
- Due date reminders/notifications
- Batch operations (multi-select)
- Export to CSV
- Task search/full-text search
- Drag-and-drop reordering
- Task comments/notes
- Collaboration features

## Dependencies

- **UI Components:** shadcn/ui (Button, Badge, Card, Input, Select, etc.)
- **Date Handling:** date-fns with Spanish locale
- **Icons:** lucide-react
- **Database:** Drizzle ORM, PostgreSQL
- **Authentication:** Auth.js (Next.js)
- **Notifications:** sonner (toast library)

## Related Files

- **Database queries:** `lib/db/queries.ts` (createTodoItem, updateTodoItem, etc.)
- **Database schema:** `lib/db/schema.ts` (todoItem table)
- **Error handling:** `lib/errors.ts` (ChatSDKError)
- **Authentication:** `app/(auth)/auth.ts`
- **Toast component:** `components/toast.tsx`
- **UI components:** `components/ui/*`
