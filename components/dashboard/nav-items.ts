import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  FileText,
  Settings,
  Share2,
  Sliders,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const aiAgentsSection: NavSection = {
  title: "AI Agents",
  items: [
    {
      label: "Chat General",
      href: "/dashboard/agents/chat-general",
      icon: Bot,
      badge: "New",
    },
    {
      label: "Multi-Herramientas",
      href: "/dashboard/agents/multi-tools",
      icon: Sliders,
    },
    {
      label: "Chat RAG",
      href: "/dashboard/agents/rag",
      icon: FileText,
    },
    {
      label: "Multiagentes",
      href: "/dashboard/agents/multi-agents",
      icon: Users,
      badge: "Beta",
    },
  ],
};

export const toolsSection: NavSection = {
  title: "Tools",
  items: [
    {
      label: "Chat Usuarios",
      href: "/dashboard/tools/user-chat",
      icon: Share2,
    },
    {
      label: "Lista Tareas",
      href: "/dashboard/tools/tasks",
      icon: FileText,
    },
    {
      label: "Storage",
      href: "/dashboard/tools/storage",
      icon: FileText,
      badge: "Coming Soon",
    },
  ],
};

export const accountSection: NavSection = {
  title: "Account",
  items: [
    {
      label: "Perfil",
      href: "/dashboard/profile",
      icon: Users,
    },
    {
      label: "Configuración",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      label: "Métricas",
      href: "/dashboard/metrics",
      icon: BarChart3,
    },
  ],
};

export const allSections = [aiAgentsSection, toolsSection, accountSection];
