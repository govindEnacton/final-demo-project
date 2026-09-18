"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Todo } from "@/lib/types";

export function CardFace({ todo }: { todo: Todo }) {
  return (
    <div className="rounded-md border bg-card p-3 text-sm select-none">
      {todo.title}
    </div>
  );
}

export function BoardCard({ todo }: { todo: Todo }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo.id,
    data: { status: todo.status },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab touch-none ${isDragging ? "opacity-30" : ""}`}
    >
      <CardFace todo={todo} />
    </div>
  );
}
