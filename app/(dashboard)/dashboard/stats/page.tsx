import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { getChatsByUserId, getTotalMessageCountByUserId } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <h1 className="mb-6 text-3xl font-bold">Usage Statistics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">
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
                <li key={chat.id} className="flex justify-between">
                  <span className="truncate">{chat.title}</span>
                  <span className="text-sm text-muted-foreground">
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
