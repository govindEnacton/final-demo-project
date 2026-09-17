"use client";

import { useTodos } from "@/hooks/use-todos";
import { TodoItem } from "@/components/todo-item";
import { useTodoUiStore } from "@/lib/todo-ui-store";

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();
  const filter = useTodoUiStore((s) => s.filter);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!todos?.length) return <p>No todos yet.</p>;

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.completed : t.completed
  );

  return (
    <ul className="space-y-2">
      {visible.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
