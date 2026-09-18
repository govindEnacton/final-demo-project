"use client";

import { useTodos } from "@/hooks/use-todos";
import { TodoItem } from "@/components/todo-item";
import { useTodoUiStore } from "@/lib/todo-ui-store";
import { Inbox } from "lucide-react";

function SkeletonItem() {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="size-4 rounded animate-shimmer" />
        <div className="h-4 w-48 rounded animate-shimmer" />
        <div className="ml-auto h-5 w-16 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();
  const filter = useTodoUiStore((s) => s.filter);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-8 text-center animate-fade-in">
        <p className="text-destructive font-medium">
          Failed to load todos
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <div className="glass rounded-xl p-12 text-center animate-fade-in-up">
        <Inbox className="mx-auto size-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold text-foreground/80">
          No tasks yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first todo above to get started
        </p>
      </div>
    );
  }

  const visible = todos.filter((t) =>
    filter === "all"
      ? true
      : filter === "open"
        ? t.status !== "done"
        : t.status === "done"
  );

  if (!visible.length) {
    return (
      <div className="glass rounded-xl p-8 text-center animate-fade-in">
        <p className="text-muted-foreground">
          No {filter === "open" ? "open" : "completed"} tasks
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 stagger-children">
      {visible.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
