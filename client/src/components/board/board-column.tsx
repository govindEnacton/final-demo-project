"use client";

import { useDroppable } from "@dnd-kit/core";
import { BoardCard } from "./board-card";
import type { Status, Todo } from "@/lib/types";

type Props = { status: Status; label: string; todos: Todo[] };

const COLUMN_COLORS: Record<Status, { dot: string; bg: string; border: string }> = {
  todo: {
    dot: "bg-[oklch(0.7_0.15_250)]",
    bg: "bg-[oklch(0.7_0.15_250_/_0.04)]",
    border: "border-[oklch(0.7_0.15_250_/_0.4)]",
  },
  in_progress: {
    dot: "bg-[oklch(0.78_0.15_80)]",
    bg: "bg-[oklch(0.78_0.15_80_/_0.04)]",
    border: "border-[oklch(0.78_0.15_80_/_0.4)]",
  },
  done: {
    dot: "bg-[oklch(0.72_0.17_160)]",
    bg: "bg-[oklch(0.72_0.17_160_/_0.04)]",
    border: "border-[oklch(0.72_0.17_160_/_0.4)]",
  },
};

export function BoardColumn({ status, label, todos }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status },
  });

  const colors = COLUMN_COLORS[status];

  return (
    <div className="flex flex-col gap-2 animate-fade-in-up">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`size-2.5 rounded-full ${colors.dot}`} />
          <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
        </div>
        <span
          className={`inline-flex size-5 items-center justify-center rounded-md text-[10px] font-bold ${colors.bg} text-foreground/70`}
        >
          {todos.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-col gap-2 rounded-xl border p-2.5 transition-all duration-300 ${
          isOver
            ? `${colors.border} ${colors.bg} shadow-lg animate-pulse-border`
            : "border-border/40 bg-muted/20"
        }`}
      >
        {todos.length === 0 ? (
          <div
            className={`flex flex-1 items-center justify-center rounded-lg border border-dashed p-6 transition-colors ${
              isOver ? colors.border : "border-border/30"
            }`}
          >
            <p className="text-xs text-muted-foreground/50">
              {isOver ? "Drop here" : "No tasks"}
            </p>
          </div>
        ) : (
          todos.map((todo) => <BoardCard key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
}
