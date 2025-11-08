import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getChatsByUserId,
  getTotalMessageCountByUserId,
} from "@/lib/db/queries";

export default async function StatsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [chats, messageCount] = await Promise.all([
    getChatsByUserId({ id: session.user.id }),
    getTotalMessageCountByUserId({ userId: session.user.id }),
  ]);

  const stats = [
    {
      title: "Total Chats",
      value: chats.length,
      description: "Conversations created",
    },
    {
      title: "Total Messages",
      value: messageCount,
      description: "Messages sent and received",
    },
    {
      title: "Average per Chat",
      value: chats.length > 0 ? Math.round(messageCount / chats.length) : 0,
      description: "Messages per conversation",
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 font-bold text-3xl">Usage Statistics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-3xl">{stat.value}</p>
              <p className="text-muted-foreground text-sm">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {chats.length === 0 ? (
            <p className="text-muted-foreground">No activity yet</p>
          ) : (
            <ul className="space-y-2">
              {chats.slice(0, 5).map((chat) => (
                <li className="flex justify-between" key={chat.id}>
                  <span className="truncate">{chat.title}</span>
                  <span className="text-muted-foreground text-sm">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
