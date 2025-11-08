import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-3xl">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-medium text-sm">Email</label>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>

          <div>
            <label className="font-medium text-sm">Account Type</label>
            <p className="text-muted-foreground">
              {session.user.type === "regular" ? "Registered User" : "Guest"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Preferences coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
