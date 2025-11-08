# Dashboard Restructure - Implementation Plan

## Overview

This document provides a step-by-step implementation plan for the dashboard restructure architecture. Each phase is designed to be atomic and testable independently.

**Estimated Total Effort**: 16-24 developer hours

**Recommended Team Size**: 1-2 developers

**Timeline**: 2-3 working days

---

## Phase 1: Project Preparation (1 hour)

### 1.1 Create Feature Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/dashboard-restructure
```

### 1.2 Verify Environment

**Tasks**:
- [ ] Ensure local development environment is running
- [ ] Verify database connection
- [ ] Test authentication flows (login, register)
- [ ] Run existing tests to ensure clean baseline

**Commands**:
```bash
pnpm dev                    # Start dev server
pnpm db:studio              # Verify database connection
pnpm test                   # Run existing tests
```

**Success Criteria**:
- Dev server runs on `http://localhost:3000`
- Database queries execute successfully
- All existing tests pass

---

## Phase 2: Directory Structure Setup (1 hour)

### 2.1 Create Route Group Directories

**Commands**:
```bash
# Create public route group
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(public)"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(public)\_components"

# Create dashboard route group
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\dashboard"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\dashboard\chat"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\dashboard\chat\[id]"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\dashboard\documents"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\dashboard\stats"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\dashboard\settings"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\_components"
mkdir "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\_components\stats"
```

### 2.2 Verify Structure

```bash
tree app /F
```

**Expected Output**:
```
app/
├── (auth)/
├── (chat)/          # Will be deprecated
├── (dashboard)/     # NEW
│   ├── dashboard/
│   └── _components/
├── (public)/        # NEW
│   └── _components/
├── api/
├── layout.tsx
└── globals.css
```

### 2.3 Create `.gitkeep` Files (Temporary)

For empty directories to be tracked by git:

```bash
echo "" > "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\_components\.gitkeep"
echo "" > "C:\PROYECTOS\APPS\cjhirashi-ai\app\(public)\_components\.gitkeep"
```

**Tasks**:
- [ ] All directories created
- [ ] Structure verified with `tree` command
- [ ] `.gitkeep` files added to empty directories

---

## Phase 3: Create Public Homepage (2 hours)

### 3.1 Create Public Layout

**File**: `app/(public)/layout.tsx`

```typescript
import type { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header - no sidebar */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">AI Chatbot</h1>
          <nav className="flex gap-4">
            <a href="/login" className="text-sm hover:underline">
              Login
            </a>
            <a href="/register" className="text-sm hover:underline">
              Register
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 AI Chatbot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
```

### 3.2 Create Homepage Components

**File**: `app/(public)/_components/hero-section.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <h1 className="mb-6 text-5xl font-bold tracking-tight">
        Your AI Assistant, Reimagined
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
        Experience the next generation of conversational AI. Create documents,
        analyze data, and get intelligent responses powered by advanced
        language models.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/register">Get Started</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
```

**File**: `app/(public)/_components/features-grid.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, BarChart3, Settings } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Chat",
      description:
        "Engage in natural conversations with AI models that understand context and provide accurate responses.",
    },
    {
      icon: FileText,
      title: "Document Creation",
      description:
        "Generate and edit documents, code, and spreadsheets with AI assistance.",
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description:
        "Track your AI usage, token consumption, and conversation history.",
    },
    {
      icon: Settings,
      title: "Customizable",
      description:
        "Choose from multiple AI models and customize your experience.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">
        Everything you need to work with AI
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

### 3.3 Create Homepage Page

**File**: `app/(public)/page.tsx`

```typescript
import { HeroSection } from "./_components/hero-section";
import { FeaturesGrid } from "./_components/features-grid";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
    </>
  );
}
```

### 3.4 Test Public Routes

**Tasks**:
- [ ] Visit `http://localhost:3000/` - should show new homepage
- [ ] Click "Get Started" - should navigate to `/register`
- [ ] Click "Sign In" - should navigate to `/login`
- [ ] Verify layout renders correctly (header, footer, content)

**Verification**:
```bash
# In browser, verify:
# - / shows homepage with hero and features
# - No sidebar visible
# - Login/Register links work
```

---

## Phase 4: Create Dashboard Layout (1.5 hours)

### 4.1 Create Dashboard Layout

**File**: `app/(dashboard)/layout.tsx`

```typescript
import { cookies } from "next/headers";
import Script from "next/script";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";

export const experimental_ppr = true;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // This should never happen due to middleware, but as a safety check
  if (!session) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <AppSidebar user={session?.user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
```

### 4.2 Create Dashboard Home Page

**File**: `app/(dashboard)/dashboard/page.tsx`

```typescript
import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to chat by default
  redirect("/dashboard/chat");
}
```

### 4.3 Test Dashboard Layout (Without Content)

**Tasks**:
- [ ] Start dev server
- [ ] Login as registered user
- [ ] Manually navigate to `/dashboard`
- [ ] Verify redirect to `/dashboard/chat` (will 404 for now, that's expected)
- [ ] Verify sidebar renders

---

## Phase 5: Migrate Chat Pages (2 hours)

### 5.1 Move Chat Actions

**Command**:
```bash
copy "C:\PROYECTOS\APPS\cjhirashi-ai\app\(chat)\actions.ts" "C:\PROYECTOS\APPS\cjhirashi-ai\app\(dashboard)\actions.ts"
```

### 5.2 Create New Chat Page

**File**: `app/(dashboard)/dashboard/chat/page.tsx`

**Copy from**: `app/(chat)/page.tsx`

**Changes**:
- Update import path for `auth`: `from "@/app/(auth)/auth"`
- Update import path for actions: `from "@/app/(dashboard)/actions"` (if any)
- Remove guest redirect logic (middleware handles this)

**Full Code**:
```typescript
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { auth } from "@/app/(auth)/auth";

export default async function NewChatPage() {
  const session = await auth();

  // Middleware ensures we have a session, but double-check
  if (!session) {
    redirect("/login");
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          autoResume={false}
          id={id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialMessages={[]}
          initialVisibilityType="private"
          isReadonly={false}
          key={id}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        autoResume={false}
        id={id}
        initialChatModel={modelIdFromCookie.value}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        key={id}
      />
      <DataStreamHandler />
    </>
  );
}
```

### 5.3 Create Chat Detail Page

**File**: `app/(dashboard)/dashboard/chat/[id]/page.tsx`

**Copy from**: `app/(chat)/chat/[id]/page.tsx`

**Changes**:
- Update import path for `auth`: `from "@/app/(auth)/auth"`
- Remove guest redirect logic (middleware handles this)

**Full Code**:
```typescript
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";

export default async function ChatPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (chat.visibility === "private") {
    if (!session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          autoResume={true}
          id={chat.id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialLastContext={chat.lastContext ?? undefined}
          initialMessages={uiMessages}
          initialVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        autoResume={true}
        id={chat.id}
        initialChatModel={chatModelFromCookie.value}
        initialLastContext={chat.lastContext ?? undefined}
        initialMessages={uiMessages}
        initialVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
      />
      <DataStreamHandler />
    </>
  );
}
```

### 5.4 Test Chat Migration

**Tasks**:
- [ ] Login as registered user
- [ ] Navigate to `/dashboard/chat`
- [ ] Verify new chat interface loads
- [ ] Create a test message
- [ ] Navigate to `/dashboard/chat/[id]` with existing chat ID
- [ ] Verify chat history loads correctly

---

## Phase 6: Update Middleware (2 hours)

### 6.1 Backup Current Middleware

```bash
copy "C:\PROYECTOS\APPS\cjhirashi-ai\middleware.ts" "C:\PROYECTOS\APPS\cjhirashi-ai\middleware.ts.backup"
```

### 6.2 Replace Middleware

**File**: `middleware.ts`

**Replace entire contents with**:

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Playwright health check
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // 2. Allow all /api/auth routes (login, register, session)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // 3. PUBLIC ROUTES: Allow without authentication
  const publicRoutes = ["/"];
  const authRoutes = ["/login", "/register"];

  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    // Already authenticated? Redirect away from auth pages
    if (token && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 4. DASHBOARD ROUTES: Require registered user authentication
  if (pathname.startsWith("/dashboard")) {
    // No session? → Login with return URL
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists but is guest? → Force registration
    const isGuest = guestRegex.test(token?.email ?? "");
    if (isGuest) {
      const registerUrl = new URL("/register", request.url);
      registerUrl.searchParams.set(
        "message",
        "Please register to access the dashboard"
      );
      return NextResponse.redirect(registerUrl);
    }

    // Registered user → Allow access
    return NextResponse.next();
  }

  // 5. API ROUTES: Require authentication
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if guest trying to access protected endpoints
    const isGuest = guestRegex.test(token?.email ?? "");
    const guestRestrictedEndpoints = ["/api/document", "/api/files/upload"];

    if (
      isGuest &&
      guestRestrictedEndpoints.some((ep) => pathname.startsWith(ep))
    ) {
      return NextResponse.json(
        { error: "This feature requires a registered account" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 6. LEGACY ROUTES: Handle backward compatibility
  if (pathname.startsWith("/chat/")) {
    const chatId = pathname.replace("/chat/", "");
    return NextResponse.redirect(
      new URL(`/dashboard/chat/${chatId}`, request.url)
    );
  }

  // 7. Default: Allow (for static assets, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/chat/:path*", // Legacy route handling
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

### 6.3 Test Middleware

**Test Cases**:

| Action | Expected Result |
|--------|----------------|
| Visit `/` without login | Show homepage |
| Visit `/dashboard` without login | Redirect to `/login?returnUrl=/dashboard` |
| Visit `/login` when logged in | Redirect to `/dashboard` |
| Visit `/dashboard` when logged in | Show dashboard |
| Visit `/api/chat` without token | 401 error |
| Visit `/chat/123` (legacy) | Redirect to `/dashboard/chat/123` |

**Manual Testing**:
```bash
# Test unauthenticated access
# 1. Clear cookies (or use incognito)
# 2. Visit http://localhost:3000/ → Should show homepage
# 3. Visit http://localhost:3000/dashboard → Should redirect to login
# 4. Visit http://localhost:3000/login → Should show login page

# Test authenticated access
# 5. Login as registered user
# 6. Visit http://localhost:3000/ → Should show homepage
# 7. Visit http://localhost:3000/login → Should redirect to dashboard
# 8. Visit http://localhost:3000/dashboard → Should show dashboard

# Test legacy URLs
# 9. Visit http://localhost:3000/chat/existing-id → Should redirect to /dashboard/chat/existing-id
```

---

## Phase 7: Update Components (1.5 hours)

### 7.1 Update AppSidebar Navigation

**File**: `components/app-sidebar.tsx`

**Find** the section that renders sidebar menu items (likely using `SidebarMenu` or links)

**Update** navigation links to point to:
- New chat: `/dashboard/chat`
- Chat history: `/dashboard/chat/[id]`
- Documents: `/dashboard/documents` (new)
- Stats: `/dashboard/stats` (new)
- Settings: `/dashboard/settings` (new)

**Example changes**:

```typescript
// OLD:
<Link href="/">New Chat</Link>
<Link href={`/chat/${chat.id}`}>{chat.title}</Link>

// NEW:
<Link href="/dashboard/chat">New Chat</Link>
<Link href={`/dashboard/chat/${chat.id}`}>{chat.title}</Link>
```

**Note**: The exact code will depend on your current sidebar implementation. Use `Read` tool to see current code, then apply changes.

### 7.2 Update SidebarUserNav

**File**: `components/sidebar-user-nav.tsx`

**Changes**:

1. Remove guest detection display (line 62):
```typescript
// OLD:
<span className="truncate" data-testid="user-email">
  {isGuest ? "Guest" : user?.email}
</span>

// NEW:
<span className="truncate" data-testid="user-email">
  {user?.email}
</span>
```

2. Remove guest login redirect (lines 97-98):
```typescript
// OLD:
if (isGuest) {
  router.push("/login");
} else {
  signOut({ redirectTo: "/" });
}

// NEW:
signOut({ redirectTo: "/login" });
```

3. Update button text (line 107):
```typescript
// OLD:
{isGuest ? "Login to your account" : "Sign out"}

// NEW:
Sign out
```

**Full updated section**:
```typescript
<DropdownMenuItem asChild data-testid="user-nav-item-auth">
  <button
    className="w-full cursor-pointer"
    onClick={() => {
      if (status === "loading") {
        toast({
          type: "error",
          description: "Checking authentication status, please try again!",
        });
        return;
      }

      signOut({ redirectTo: "/login" });
    }}
    type="button"
  >
    Sign out
  </button>
</DropdownMenuItem>
```

### 7.3 Test Component Updates

**Tasks**:
- [ ] Login as registered user
- [ ] Navigate to `/dashboard/chat`
- [ ] Verify sidebar shows correct navigation links
- [ ] Click "New Chat" → should stay on `/dashboard/chat` with new UUID
- [ ] Click existing chat → should navigate to `/dashboard/chat/[id]`
- [ ] Open user menu → should show email (not "Guest")
- [ ] Click "Sign out" → should redirect to `/login`

---

## Phase 8: Create New Dashboard Pages (3 hours)

### 8.1 Create Documents Page

**File**: `app/(dashboard)/dashboard/documents/page.tsx`

```typescript
import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { getDocumentsByUserId } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // TODO: Implement getDocumentsByUserId in lib/db/queries.ts
  const documents = await getDocumentsByUserId({ userId: session.user.id });

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Documents</h1>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No documents yet. Create one in a chat!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="truncate">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
                {/* Add view/edit actions here */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Add to**: `lib/db/queries.ts`

```typescript
export async function getDocumentsByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(document)
      .where(eq(document.userId, userId))
      .orderBy(desc(document.createdAt));
  } catch (error) {
    console.error("Failed to get documents by user ID", error);
    return [];
  }
}
```

### 8.2 Create Stats Page

**File**: `app/(dashboard)/dashboard/stats/page.tsx`

```typescript
import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { getChatsByUserId, getMessageCountByUserId } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StatsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [chats, messageCount] = await Promise.all([
    getChatsByUserId({ id: session.user.id }),
    getMessageCountByUserId({ userId: session.user.id }),
  ]);

  const stats = [
    {
      title: "Total Chats",
      value: chats.length,
      description: "Conversations created",
    },
    {
      title: "Total Messages",
      value: messageCount,
      description: "Messages sent and received",
    },
    {
      title: "Average per Chat",
      value: chats.length > 0 ? Math.round(messageCount / chats.length) : 0,
      description: "Messages per conversation",
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Usage Statistics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {chats.length === 0 ? (
            <p className="text-muted-foreground">No activity yet</p>
          ) : (
            <ul className="space-y-2">
              {chats.slice(0, 5).map((chat) => (
                <li key={chat.id} className="flex justify-between">
                  <span className="truncate">{chat.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Add to**: `lib/db/queries.ts`

```typescript
export async function getMessageCountByUserId({ userId }: { userId: string }) {
  try {
    const chats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));

    if (chats.length === 0) return 0;

    const chatIds = chats.map((c) => c.id);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(inArray(message.chatId, chatIds));

    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("Failed to get message count by user ID", error);
    return 0;
  }
}
```

### 8.3 Create Settings Page

**File**: `app/(dashboard)/dashboard/settings/page.tsx`

```typescript
import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Account Type</label>
            <p className="text-muted-foreground">
              {session.user.type === "regular" ? "Registered User" : "Guest"}
            </p>
          </div>

          {/* TODO: Add password change form */}
          {/* TODO: Add preferences (theme, default model, etc.) */}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Preferences coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 8.4 Test New Pages

**Tasks**:
- [ ] Navigate to `/dashboard/documents` → should show documents list
- [ ] Navigate to `/dashboard/stats` → should show usage statistics
- [ ] Navigate to `/dashboard/settings` → should show account settings
- [ ] Verify all pages require authentication
- [ ] Verify data displays correctly

---

## Phase 9: Authentication Cleanup (1 hour)

### 9.1 Update Auth Configuration

**File**: `app/(auth)/auth.ts`

**Remove** guest credentials provider (lines 68-75):

```typescript
// DELETE THIS BLOCK:
Credentials({
  id: "guest",
  credentials: {},
  async authorize() {
    const [guestUser] = await createGuestUser();
    return { ...guestUser, type: "guest" };
  },
}),
```

### 9.2 Delete Guest Route

**Delete file**: `app/(auth)/api/auth/guest/route.ts`

```bash
del "C:\PROYECTOS\APPS\cjhirashi-ai\app\(auth)\api\auth\guest\route.ts"
```

### 9.3 Mark createGuestUser as Deprecated

**File**: `lib/db/queries.ts`

**Find** `createGuestUser` function and add deprecation comment:

```typescript
/**
 * @deprecated Guest users are no longer created automatically.
 * This function is kept for backward compatibility with existing data.
 * Do not use in new code.
 */
export async function createGuestUser() {
  // Existing implementation stays
}
```

### 9.4 Test Authentication

**Tasks**:
- [ ] Clear browser cookies
- [ ] Visit `/` → should NOT redirect to guest creation
- [ ] Visit `/dashboard` → should redirect to `/login`
- [ ] Register new account → should create regular user
- [ ] Login with new account → should redirect to `/dashboard`
- [ ] Verify no guest session is created

---

## Phase 10: Update Sidebar Navigation (1 hour)

### 10.1 Add Dashboard Navigation Links

**File**: `components/app-sidebar.tsx`

**Find** the section that renders navigation (likely near top of sidebar)

**Add** navigation section for dashboard routes:

```typescript
// Add this above the chat history section
<SidebarGroup>
  <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/dashboard/chat">
          <MessageSquare className="size-4" />
          <span>Chat</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/dashboard/documents">
          <FileText className="size-4" />
          <span>Documents</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/dashboard/stats">
          <BarChart3 className="size-4" />
          <span>Statistics</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/dashboard/settings">
          <Settings className="size-4" />
          <span>Settings</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarGroup>
```

**Add** imports at top of file:

```typescript
import { MessageSquare, FileText, BarChart3, Settings } from "lucide-react";
```

### 10.2 Update History Links

**File**: `components/sidebar-history.tsx` or wherever chat history is rendered

**Find** links to individual chats, likely:
```typescript
<Link href={`/chat/${chat.id}`}>
```

**Replace with**:
```typescript
<Link href={`/dashboard/chat/${chat.id}`}>
```

### 10.3 Test Sidebar Navigation

**Tasks**:
- [ ] Login as registered user
- [ ] Verify sidebar shows new sections: Chat, Documents, Statistics, Settings
- [ ] Click each link → should navigate to correct page
- [ ] Verify chat history links point to `/dashboard/chat/[id]`
- [ ] Verify "New Chat" button points to `/dashboard/chat`

---

## Phase 11: Handle Login Return URL (30 minutes)

### 11.1 Update Login Page

**File**: `app/(auth)/login/page.tsx`

**Add** `returnUrl` handling after successful login:

**Find** the `useEffect` that handles successful login (around line 39):

```typescript
} else if (state.status === "success") {
  setIsSuccessful(true);
  updateSession();
  router.refresh();
}
```

**Replace with**:

```typescript
} else if (state.status === "success") {
  setIsSuccessful(true);
  updateSession();

  // Check for returnUrl in query params
  const searchParams = new URLSearchParams(window.location.search);
  const returnUrl = searchParams.get("returnUrl");

  if (returnUrl) {
    router.push(returnUrl);
  } else {
    router.push("/dashboard");
  }
}
```

### 11.2 Update Login Action

**File**: `app/(auth)/actions.ts`

**Find** the `login` function

**Update** the redirect URL in success case:

```typescript
// Find this line:
return { status: "success" };

// Make sure the signIn call includes redirectTo
await signIn("credentials", {
  email,
  password,
  redirect: false, // Handle redirect in client
});

return { status: "success" };
```

### 11.3 Test Return URL Flow

**Tasks**:
- [ ] Logout
- [ ] Visit `/dashboard/stats` → redirected to `/login?returnUrl=/dashboard/stats`
- [ ] Login with credentials
- [ ] Should be redirected to `/dashboard/stats` (not `/dashboard`)
- [ ] Verify URL parameter is respected

---

## Phase 12: Testing and Validation (2 hours)

### 12.1 Manual Test Checklist

**Unauthenticated User Flow**:
- [ ] Visit `/` → Homepage displays
- [ ] Click "Get Started" → Navigate to `/register`
- [ ] Click "Sign In" (header) → Navigate to `/login`
- [ ] Try to visit `/dashboard` → Redirect to `/login?returnUrl=/dashboard`
- [ ] Try to visit `/dashboard/chat` → Redirect to `/login`

**Registration Flow**:
- [ ] Fill registration form
- [ ] Submit form
- [ ] Account created successfully
- [ ] Redirected to `/dashboard`
- [ ] Dashboard displays with sidebar

**Login Flow**:
- [ ] Visit `/login`
- [ ] Fill login form
- [ ] Submit form
- [ ] Login successful
- [ ] Redirected to `/dashboard` or `returnUrl`

**Dashboard Navigation**:
- [ ] Click "Chat" → Navigate to `/dashboard/chat`
- [ ] Click "Documents" → Navigate to `/dashboard/documents`
- [ ] Click "Statistics" → Navigate to `/dashboard/stats`
- [ ] Click "Settings" → Navigate to `/dashboard/settings`
- [ ] Create new chat → New chat UUID generated
- [ ] Send message → Message displays in chat
- [ ] Navigate to existing chat → Chat loads with history

**Legacy URL Handling**:
- [ ] Visit `/chat/existing-id` → Redirect to `/dashboard/chat/existing-id`
- [ ] Visit `/chat/invalid-id` → 404 page

**Sign Out Flow**:
- [ ] Click user menu → Dropdown opens
- [ ] Click "Sign out" → Redirected to `/login`
- [ ] Try to visit `/dashboard` → Redirected to `/login`

**Edge Cases**:
- [ ] Visit `/login` when already logged in → Redirect to `/dashboard`
- [ ] Visit `/register` when already logged in → Redirect to `/dashboard`
- [ ] Visit non-existent route → 404 page
- [ ] API requests without auth → 401 error

### 12.2 Automated Test Updates

**File**: `tests/e2e/session.test.ts` (if exists)

**Update** test expectations:

```typescript
// OLD:
expect(page.url()).toContain('/');

// NEW:
expect(page.url()).toContain('/dashboard');
```

**Run tests**:
```bash
pnpm test
```

### 12.3 Performance Check

**Test**:
- [ ] Homepage loads in < 1s
- [ ] Dashboard loads in < 2s
- [ ] Chat message response in < 500ms (excluding AI response time)
- [ ] Navigation between pages is instant (< 200ms)

**Tools**:
- Chrome DevTools Network tab
- Lighthouse audit

---

## Phase 13: Cleanup Old Routes (30 minutes)

### 13.1 Mark Old Routes as Deprecated

**Do NOT delete** `app/(chat)/` immediately. Instead, add deprecation notices.

**File**: `app/(chat)/page.tsx`

**Add** at the top:

```typescript
/**
 * @deprecated This route has been moved to /dashboard/chat
 * Kept for backward compatibility during migration period.
 * Will be removed in next major version.
 */
```

**Create**: `app/(chat)/page.tsx` redirect

```typescript
import { redirect } from "next/navigation";

/**
 * @deprecated Legacy chat route. Redirects to new dashboard location.
 */
export default function LegacyChatPage() {
  redirect("/dashboard/chat");
}
```

**Create**: `app/(chat)/chat/[id]/page.tsx` redirect

```typescript
import { redirect } from "next/navigation";

/**
 * @deprecated Legacy chat route. Redirects to new dashboard location.
 */
export default async function LegacyChatDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  redirect(`/dashboard/chat/${params.id}`);
}
```

### 13.2 Plan for Full Removal

**Create**: `docs/architecture/dashboard-restructure-cleanup.md`

Document plan to fully remove `app/(chat)/` directory in 2-4 weeks after confirming no issues.

---

## Phase 14: Documentation and Deployment (1 hour)

### 14.1 Update README (if exists)

**File**: `README.md` (if exists)

**Add** section about new routing structure:

```markdown
## Routing Structure

- `/` - Public homepage
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Main dashboard (requires authentication)
  - `/dashboard/chat` - New chat interface
  - `/dashboard/chat/[id]` - Specific chat conversation
  - `/dashboard/documents` - Document management
  - `/dashboard/stats` - Usage statistics
  - `/dashboard/settings` - User settings
```

### 14.2 Create Deployment Checklist

**File**: `docs/architecture/dashboard-restructure-deployment.md`

```markdown
# Deployment Checklist

## Pre-Deployment
- [ ] All tests passing
- [ ] Manual QA completed
- [ ] Performance benchmarks met
- [ ] Database backups created

## Deployment
- [ ] Deploy to staging
- [ ] Smoke test on staging
- [ ] Deploy to production
- [ ] Monitor error logs for 1 hour

## Post-Deployment
- [ ] Verify homepage loads
- [ ] Verify registration works
- [ ] Verify login works
- [ ] Verify dashboard access
- [ ] Verify legacy URLs redirect
- [ ] Check analytics for errors
```

### 14.3 Git Commit and PR

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Restructure app to registration-required dashboard model

- Create public homepage at / with hero and features
- Move chat to /dashboard/chat/* (authenticated only)
- Add new dashboard routes: documents, stats, settings
- Update middleware to enforce authentication on /dashboard/*
- Remove automatic guest user creation
- Add backward compatibility redirects for legacy /chat/* URLs
- Update sidebar navigation with new dashboard sections

Breaking changes:
- / now shows public homepage (was chat interface)
- Chat moved to /dashboard/chat (requires registration)
- Guest users must register to access dashboard

Refs: docs/architecture/dashboard-restructure-architecture.md"

# Push to remote
git push origin feature/dashboard-restructure

# Create PR (if using GitHub CLI)
gh pr create --title "Dashboard Restructure: Registration-Required Model" --body-file docs/architecture/dashboard-restructure-architecture.md
```

---

## Phase 15: Monitoring and Rollback Plan (30 minutes)

### 15.1 Monitoring Checklist

**Monitor for 24 hours after deployment**:

- [ ] Error rate (should be < 1%)
- [ ] Login success rate (should be > 95%)
- [ ] Registration rate (monitor for drop-off)
- [ ] 404 errors (should not increase significantly)
- [ ] Page load times (should remain under 2s)
- [ ] User feedback/complaints

### 15.2 Rollback Plan

**If critical issues occur**:

1. **Immediate Rollback**:
```bash
git checkout main
git push origin main --force
```

2. **Restore from backup**:
```bash
# If database changes were made
# Restore from pre-deployment backup
```

3. **Hotfix Deployment**:
```bash
# If issue is minor, create hotfix branch
git checkout -b hotfix/dashboard-issue
# Make fix
git commit -m "hotfix: Fix critical issue in dashboard"
git push origin hotfix/dashboard-issue
```

---

## Completion Criteria

### Phase Sign-Off

Each phase is considered complete when:

1. All tasks in the phase are checked off
2. Manual testing for that phase passes
3. No console errors or warnings
4. Code follows existing project conventions
5. Changes are committed to feature branch

### Project Completion

The entire implementation is complete when:

1. All 15 phases are complete
2. Full manual test checklist passes (Phase 12)
3. All automated tests pass
4. Documentation is updated
5. Code review is approved
6. Successfully deployed to staging
7. Stakeholder sign-off obtained

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|-------------|
| 1. Preparation | 1 hour | None |
| 2. Directory Setup | 1 hour | Phase 1 |
| 3. Public Homepage | 2 hours | Phase 2 |
| 4. Dashboard Layout | 1.5 hours | Phase 2 |
| 5. Migrate Chat | 2 hours | Phase 4 |
| 6. Update Middleware | 2 hours | Phase 5 |
| 7. Update Components | 1.5 hours | Phase 6 |
| 8. New Dashboard Pages | 3 hours | Phase 7 |
| 9. Auth Cleanup | 1 hour | Phase 8 |
| 10. Sidebar Navigation | 1 hour | Phase 9 |
| 11. Return URL Handling | 0.5 hours | Phase 10 |
| 12. Testing | 2 hours | Phases 1-11 |
| 13. Cleanup | 0.5 hours | Phase 12 |
| 14. Documentation | 1 hour | Phase 13 |
| 15. Monitoring Setup | 0.5 hours | Phase 14 |

**Total**: ~20 hours (2.5 days for single developer)

---

## Risk Mitigation

### High-Risk Areas

1. **Middleware Changes**: Thoroughly test all route combinations
2. **Auth Flow**: Ensure no security regressions
3. **Legacy URLs**: Verify backward compatibility

### Testing Strategy

- Manual testing at each phase
- Automated test updates
- Staging deployment before production
- Gradual rollout (feature flag if possible)

---

## Support and Questions

If issues arise during implementation:

1. Consult `dashboard-restructure-architecture.md` for design decisions
2. Check `dashboard-restructure-migration.md` for migration strategies
3. Review git history for original implementation
4. Test changes in isolation before integration

---

## Document Metadata

- **Author**: Architecture Designer Agent
- **Created**: 2025-11-07
- **Version**: 1.0
- **Status**: Ready for Implementation
- **Related Documents**:
  - `dashboard-restructure-architecture.md` (architecture design)
  - `dashboard-restructure-migration.md` (migration guide)
