"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string | boolean;
  isDisabled?: boolean;
};

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  isDisabled = false,
}: ToolCardProps) {
  const content = (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "hover:border-primary/50",
        isDisabled && "cursor-not-allowed opacity-60"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-lg p-2.5 transition-colors duration-300",
                "bg-primary/10 group-hover:bg-primary/20",
                "group-hover:text-primary"
              )}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="font-semibold text-lg transition-colors group-hover:text-primary">
                {title}
              </CardTitle>
            </div>
          </div>
          {badge && typeof badge === "string" && (
            <Badge
              className="whitespace-nowrap text-xs"
              variant={
                badge === "Coming Soon"
                  ? "secondary"
                  : badge === "Beta"
                    ? "outline"
                    : "default"
              }
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="line-clamp-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>

      {/* Hover overlay indicator */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent opacity-0 transition-opacity duration-300",
          "group-hover:border-primary/30 group-hover:opacity-100"
        )}
      />
    </Card>
  );

  if (isDisabled) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return (
    <Link
      className="block transition-transform duration-300 hover:scale-105"
      href={href}
    >
      {content}
    </Link>
  );
}
