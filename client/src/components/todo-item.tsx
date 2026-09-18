"use client";

import { memo } from "react";
import { useSetTodoStatus, useDeleteTodo } from "@/hooks/use-todos";
import { Checkbox } from "@/components/ui/checkbox";
import type { Todo, Status } from "@/lib/types";
import { Trash2, Clock, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<
  Status,
  { label: string; className: string; next: Status; nextLabel: string }
> = {
  todo: {
    label: "To Do",
    className: "status-todo",
    next: "in_progress",
    nextLabel: "Start",
  },
  in_progress: {
    label: "In Progress",
    className: "status-in_progress",
    next: "done",
    nextLabel: "Complete",
  },
  done: {
    label: "Done",
    className: "status-done",
    next: "todo",
    nextLabel: "Reopen",
  },
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

export const TodoItem = memo(function TodoItem({ todo }: { todo: Todo }) {
  const setStatus = useSetTodoStatus();
  const deleteTodo = useDeleteTodo();
  const isDone = todo.status === "done";
  const config = STATUS_CONFIG[todo.status];

  return (
    <li className="group glass rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) =>
            setStatus.mutate({
              id: todo.id,
              status: checked ? "done" : "todo",
            })
          }
          disabled={setStatus.isPending}
          className="shrink-0"
        />

        {/* Title */}
        <span
          className={`flex-1 text-sm transition-all duration-200 ${
            isDone
              ? "line-through text-muted-foreground/60"
              : "text-foreground"
          }`}
        >
          {todo.title}
        </span>

        {/* Status badge */}
        <span
          className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
        >
          {config.label}
        </span>

        {/* Move to next status */}
        <button
          onClick={() =>
            setStatus.mutate({ id: todo.id, status: config.next })
          }
          disabled={setStatus.isPending}
          className="hidden sm:inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 transition-all duration-200 hover:bg-accent hover:text-foreground group-hover:opacity-100"
          title={config.nextLabel}
        >
          <ArrowRight className="size-3" />
          {config.nextLabel}
        </button>

        {/* Time */}
        <span className="hidden items-center gap-1 text-[11px] text-muted-foreground/60 sm:inline-flex">
          <Clock className="size-3" />
          {timeAgo(todo.createdAt)}
        </span>

        {/* Delete */}
        <button
          onClick={() => deleteTodo.mutate(todo.id)}
          disabled={deleteTodo.isPending}
          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground/50 opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
});
