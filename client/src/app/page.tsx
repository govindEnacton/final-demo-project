"use client";

import { useState } from "react";
import { AddTodo } from "@/components/add-todo";
import { TodoList } from "@/components/todo-list";
import { KanbanBoard } from "@/components/board/kanban-board";
import { DragIndicator } from "@/components/board/drag-indicator";
import { useTodos } from "@/hooks/use-todos";
import { useTodoUiStore } from "@/lib/todo-ui-store";
import type { Filter } from "@/lib/todo-ui-store";
import {
  LayoutList,
  Kanban,
  ListFilter,
  CheckCircle2,
  Circle,
  Layers,
} from "lucide-react";

const FILTERS: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <Layers className="size-3.5" /> },
  { key: "open", label: "Open", icon: <Circle className="size-3.5" /> },
  { key: "done", label: "Done", icon: <CheckCircle2 className="size-3.5" /> },
];

export default function Home() {
  const [view, setView] = useState<"list" | "board">("board");
  const { data: todos } = useTodos();
  const filter = useTodoUiStore((s) => s.filter);
  const setFilter = useTodoUiStore((s) => s.setFilter);

  const totalCount = todos?.length ?? 0;
  const doneCount = todos?.filter((t) => t.status === "done").length ?? 0;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="glass rounded-2xl p-5 sm:p-6 animate-fade-in-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title + counter */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-[oklch(0.7_0.18_270)] via-[oklch(0.72_0.17_290)] to-[oklch(0.72_0.17_160)] bg-clip-text text-transparent">
                TaskFlow
              </span>
            </h1>
            {totalCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                {doneCount}/{totalCount}
              </span>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                view === "list"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="size-4" />
              List
            </button>
            <button
              onClick={() => setView("board")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                view === "board"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Kanban className="size-4" />
              Board
            </button>
          </div>
        </div>

        {/* Filter pills — only in list view */}
        {view === "list" && (
          <div className="mt-4 flex items-center gap-2 animate-fade-in">
            <ListFilter className="size-4 text-muted-foreground" />
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                    filter === f.key
                      ? "bg-accent text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add todo ── */}
      <AddTodo />

      {/* ── Content ── */}
      <div className="animate-fade-in" key={view}>
        {view === "list" ? (
          <TodoList />
        ) : (
          <div className="space-y-3">
            <DragIndicator />
            <KanbanBoard />
          </div>
        )}
      </div>
    </main>
  );
}
