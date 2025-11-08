"use client";

import { usePathname } from "next/navigation";
import type { User } from "next-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

type SidebarRouterProps = {
  user: User | undefined;
};

export function SidebarRouter({ user }: SidebarRouterProps) {
  const pathname = usePathname();

  // Use AppSidebar for chat routes, DashboardSidebar for everything else
  const isChat = pathname.includes("/dashboard/chat");

  if (isChat) {
    return <AppSidebar user={user} />;
  }

  return <DashboardSidebar user={user} />;
}
