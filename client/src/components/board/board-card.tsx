"use client";

import { useDraggable } from "@dnd-kit/core";
import { useDeleteTodo } from "@/hooks/use-todos";
import type { Todo, Status } from "@/lib/types";
import { GripVertical, Trash2, Clock } from "lucide-react";

const ACCENT_BORDER: Record<Status, string> = {
  todo: "border-l-[oklch(0.7_0.15_250)]",
  in_progress: "border-l-[oklch(0.78_0.15_80)]",
  done: "border-l-[oklch(0.72_0.17_160)]",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function CardFace({ todo }: { todo: Todo }) {
  return (
    <div
      className={`glass rounded-lg border-l-[3px] p-3 ${ACCENT_BORDER[todo.status]} transition-all duration-200`}
    >
      <p
        className={`text-sm leading-snug ${
          todo.status === "done"
            ? "line-through text-muted-foreground/60"
            : "text-foreground"
        }`}
      >
        {todo.title}
      </p>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/50">
        <Clock className="size-2.5" />
        {timeAgo(todo.createdAt)}
      </div>
    </div>
  );
}

export function BoardCard({ todo }: { todo: Todo }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo.id,
    data: { status: todo.status },
  });
  const deleteTodo = useDeleteTodo();

  return (
    <div
      ref={setNodeRef}
      className={`group relative cursor-grab touch-none transition-all duration-200 ${
        isDragging
          ? "opacity-30 scale-95"
          : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
      }`}
      {...listeners}
      {...attributes}
    >
      {/* Grip handle */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center pl-0.5 opacity-0 transition-opacity group-hover:opacity-40">
        <GripVertical className="size-3.5 text-muted-foreground" />
      </div>

      <CardFace todo={todo} />

      {/* Delete on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTodo.mutate(todo.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={deleteTodo.isPending}
        className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-md opacity-0 transition-all duration-200 hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}
