import { usePathname } from "next/navigation";

export function useDashboardContext() {
  const pathname = usePathname();

  const isDashboardMain =
    pathname === "/dashboard" ||
    (pathname.startsWith("/dashboard/") &&
      !pathname.startsWith("/dashboard/chat") &&
      !pathname.startsWith("/dashboard/agents") &&
      !pathname.startsWith("/dashboard/tools"));

  const isChat = pathname.startsWith("/dashboard/chat");

  return {
    isDashboardMain,
    isChat,
  };
}
