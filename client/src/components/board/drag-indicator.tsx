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
    <div className="animate-fade-in-up mb-4 flex items-center justify-center">
      <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm shadow-md">
        <span className="text-muted-foreground">Moving</span>
        <span className="max-w-[120px] truncate font-medium text-foreground sm:max-w-[200px]">
          {todo.title}
        </span>
        {target ? (
          <>
            <span className="text-muted-foreground/60">→</span>
            <span className="font-semibold text-primary">{target}</span>
          </>
        ) : (
          <span className="text-muted-foreground/60">...</span>
        )}
      </div>
    </div>
  );
}
