import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to chat by default
  redirect("/dashboard/chat");
}
