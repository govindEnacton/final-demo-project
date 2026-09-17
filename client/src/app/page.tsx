import { AddTodo } from "@/components/add-todo";
import { TodoList } from "@/components/todo-list";

export default function Home() {
  return (
    <main className="mx-auto w-4xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">Todos</h1>
      <AddTodo />
      <TodoList />
    </main>
  );
}
