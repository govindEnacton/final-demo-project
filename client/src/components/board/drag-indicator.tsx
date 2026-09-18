"use client";

import { useBoardStore } from "@/lib/board-store";
import { useTodos } from "@/hooks/use-todos";
import { COLUMNS } from "@/lib/types";

export function DragIndicator() {
  const activeTodoId = useBoardStore((s) => s.activeTodoId);
  const overStatus = useBoardStore((s) => s.overStatus);
  const { data: todos } = useTodos();

  if (!activeTodoId) return null;
  const todo = todos?.find((t) => t.id === activeTodoId);
  if (!todo) return null;
  const target = COLUMNS.find((c) => c.status === overStatus)?.label;

  return (
    <p className="text-sm text-muted-foreground">
      Dragging <span className="font-medium text-foreground">{todo.title}</span>
      {target ? <> → {target}</> : null}
    </p>
  );
}
