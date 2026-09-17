"use client";

import { memo } from "react";
import { useToggleTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/lib/types";

export const TodoItem = memo(function TodoItem({ todo }: { todo: Todo }) {
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  return (
    <li className="flex items-center gap-3 rounded-md border p-3">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(checked) =>
          toggleTodo.mutate({ id: todo.id, completed: checked === true })
        }
        disabled={toggleTodo.isPending}
      />
      <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto text-muted-foreground"
        onClick={() => deleteTodo.mutate(todo.id)}
        disabled={deleteTodo.isPending}
      >
        ✕
      </Button>
    </li>
  );
});
