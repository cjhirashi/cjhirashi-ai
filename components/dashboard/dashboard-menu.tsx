"use client";

import { aiAgentsSection, toolsSection } from "./nav-items";
import { ToolCard } from "./tool-card";

type DashboardMenuProps = {
  showComingSoon?: boolean;
};

export function DashboardMenu({ showComingSoon = true }: DashboardMenuProps) {
  return (
    <div className="space-y-12">
      {/* AI Agents Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-2xl tracking-tight">AI Agents</h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs">
            Featured
          </span>
        </div>
        <p className="text-muted-foreground">
          Unleash the power of AI with our specialized agents designed for
          different tasks
        </p>
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {aiAgentsSection.items.map((item) => (
            <ToolCard
              badge={item.badge}
              description={`Access the ${item.label.toLowerCase()} for intelligent conversations`}
              href={item.href}
              icon={item.icon}
              key={item.href}
              title={item.label}
            />
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-2xl tracking-tight">
            Tools & Utilities
          </h2>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 font-medium text-blue-700 text-xs dark:text-blue-400">
            Essential
          </span>
        </div>
        <p className="text-muted-foreground">
          Productivity tools to help you collaborate, manage, and organize your
          work
        </p>
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {toolsSection.items.map((item) => (
            <ToolCard
              badge={item.badge}
              description={`Use ${item.label.toLowerCase()} to improve your workflow`}
              href={item.href}
              icon={item.icon}
              isDisabled={
                showComingSoon &&
                typeof item.badge === "string" &&
                item.badge === "Coming Soon"
              }
              key={item.href}
              title={item.label}
            />
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="space-y-4 border-t pt-8">
        <h3 className="font-semibold text-lg tracking-tight">
          Getting Started
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4 transition-colors hover:bg-accent/50">
            <div className="mb-1 font-semibold">Explore AI Agents</div>
            <p className="text-muted-foreground text-sm">
              Start with our general chat or try specialized agents
            </p>
          </div>
          <div className="rounded-lg border p-4 transition-colors hover:bg-accent/50">
            <div className="mb-1 font-semibold">Collaborate</div>
            <p className="text-muted-foreground text-sm">
              Chat with team members and share insights
            </p>
          </div>
          <div className="rounded-lg border p-4 transition-colors hover:bg-accent/50">
            <div className="mb-1 font-semibold">Manage Tasks</div>
            <p className="text-muted-foreground text-sm">
              Organize your work with our task management tool
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
