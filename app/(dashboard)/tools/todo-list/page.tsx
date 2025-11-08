import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { TodoContainer } from "@/components/tools/todo-list/todo-container";
import { getServerTodos } from "./actions";

export const metadata = {
  title: "Lista de Tareas",
  description: "Gestiona tu lista de tareas de forma eficiente",
};

export default async function TodoListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const initialTodos = await getServerTodos();

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="font-bold text-3xl">Lista de Tareas</h1>
        <p className="mt-2 text-muted-foreground">
          Organiza y gestiona tus tareas de forma efectiva
        </p>
      </div>

      <TodoContainer initialTodos={initialTodos} onRefresh={getServerTodos} />
    </div>
  );
}
