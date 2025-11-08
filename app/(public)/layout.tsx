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
