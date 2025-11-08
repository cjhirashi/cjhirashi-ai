import Link from "next/link";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header - no sidebar */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <h1 className="cursor-pointer font-bold text-xl">AI Chatbot</h1>
          </Link>
          <nav className="flex gap-4">
            <Link className="text-sm hover:underline" href="/login">
              Login
            </Link>
            <Link className="text-sm hover:underline" href="/register">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2025 AI Chatbot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
