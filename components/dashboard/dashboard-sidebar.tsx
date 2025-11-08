"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { accountSection, aiAgentsSection, toolsSection } from "./nav-items";

type DashboardSidebarProps = {
  user: User | undefined;
};

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavigate = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r">
      {/* Logo/Header */}
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
              href="/dashboard"
              onClick={handleNavigate}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 font-bold text-sm text-white">
                AI
              </div>
              <span className="hidden font-bold text-lg sm:inline">
                Dashboard
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Sections */}
      <SidebarContent className="flex-1">
        {/* AI Agents Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase">
            {aiAgentsSection.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiAgentsSection.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link
                        className={cn("group relative", active && "bg-accent")}
                        href={item.href}
                        onClick={handleNavigate}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && typeof item.badge === "string" && (
                          <span
                            className={cn(
                              "ml-auto rounded-full px-2 py-0.5 text-xs",
                              item.badge === "New"
                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase">
            {toolsSection.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsSection.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link
                        className={cn("group relative", active && "bg-accent")}
                        href={item.href}
                        onClick={handleNavigate}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && typeof item.badge === "string" && (
                          <span className="ml-auto rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-700 dark:text-yellow-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase">
            {accountSection.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountSection.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link
                        className={cn("group relative", active && "bg-accent")}
                        href={item.href}
                        onClick={handleNavigate}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t">
        <SidebarSeparator />
        {user && (
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
              <Image
                alt={user.email || "User avatar"}
                className="rounded-full"
                height={32}
                src={`https://avatar.vercel.sh/${user.email}`}
                width={32}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{user.email}</p>
                <p className="truncate text-muted-foreground text-xs">Active</p>
              </div>
            </div>
            <Button
              className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                signOut({
                  redirectTo: "/login",
                })
              }
              size="sm"
              variant="ghost"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
