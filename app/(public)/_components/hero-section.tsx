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
