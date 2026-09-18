"use client";

import { memo } from "react";
import { useSetTodoStatus, useDeleteTodo } from "@/hooks/use-todos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/lib/types";

export const TodoItem = memo(function TodoItem({ todo }: { todo: Todo }) {
  const setStatus = useSetTodoStatus();
  const deleteTodo = useDeleteTodo();

  const isDone = todo.status === "done";

  return (
    <li className="flex items-center gap-3 rounded-md border p-3">
      <Checkbox
        checked={isDone}
        onCheckedChange={(checked) =>
          setStatus.mutate({ id: todo.id, status: checked ? "done" : "todo" })
        }
        disabled={setStatus.isPending}
      />
      <span className={isDone ? "line-through text-muted-foreground" : ""}>
        {todo.title}
      </span>
      <span className="ml-auto text-xs text-muted-foreground">{todo.status}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteTodo.mutate(todo.id)}
        disabled={deleteTodo.isPending}
      >
        ✕
      </Button>
    </li>
  );
});
