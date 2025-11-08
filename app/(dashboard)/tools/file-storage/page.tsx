import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { FileStorageContainer } from "@/components/tools/file-storage/file-storage-container";
import { getServerFiles } from "./actions";

export const metadata = {
  title: "Almacenamiento de Archivos",
  description: "Sube y gestiona tus archivos en la nube",
};

export default async function FileStoragePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const initialFiles = await getServerFiles();

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl">Almacenamiento de Archivos</h1>
        <p className="mt-2 text-muted-foreground">
          Sube y gestiona tus archivos de forma segura en la nube
        </p>
      </div>

      {/* Container */}
      <FileStorageContainer initialFiles={initialFiles} />
    </div>
  );
}
