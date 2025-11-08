import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocumentsByUserId } from "@/lib/db/queries";

export default async function DocumentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const documents = await getDocumentsByUserId({ userId: session.user.id });

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 font-bold text-3xl">Documents</h1>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No documents yet. Create one in a chat!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="truncate">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Created: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
