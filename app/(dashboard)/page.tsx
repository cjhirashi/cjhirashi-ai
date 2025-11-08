import { DashboardMenu } from "@/components/dashboard/dashboard-menu";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="space-y-2">
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Welcome to Your Dashboard
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Explore AI agents and productivity tools to enhance your workflow
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <DashboardMenu showComingSoon={true} />
        </div>
      </div>
    </div>
  );
}
