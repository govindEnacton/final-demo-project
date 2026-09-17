"use client";

import { useQuery } from "@tanstack/react-query";
import { AddTodo } from "@/components/add-todo";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch("http://localhost:3000/todos");
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
};


export default function Home() {
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-bold">Todos</h1>
      <AddTodo />
      {todos?.length === 0 && <p>No todos yet.</p>}
      {isLoading ? <div> nothing yet , loading.... </div> :
        todos?.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2">
            <div>{todo.completed ? "✅" : "⬜"}</div>
            <div>{todo.title}</div>
            <div className="text-gray-400">#{todo.id}</div>
          </div>
        ))}
    </main>
  );
}
