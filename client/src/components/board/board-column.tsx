"use client";

import { useDroppable } from "@dnd-kit/core";
import { BoardCard } from "./board-card";
import type { Status, Todo } from "@/lib/types";

type Props = { status: Status; label: string; todos: Todo[] };

export function BoardColumn({ status, label, todos }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="text-xs text-muted-foreground">{todos.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-[300px] flex-col gap-2 rounded-lg border p-2 transition-colors ${
          isOver ? "border-primary bg-primary/5" : "bg-muted/30"
        }`}
      >
        {todos.map((todo) => (
          <BoardCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
