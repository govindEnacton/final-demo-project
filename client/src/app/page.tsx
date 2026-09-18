"use client";

import { useState } from "react";
import { AddTodo } from "@/components/add-todo";
import { TodoList } from "@/components/todo-list";
import { KanbanBoard } from "@/components/board/kanban-board";
import { DragIndicator } from "@/components/board/drag-indicator";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button
            size="sm"
            variant={view === "board" ? "default" : "outline"}
            onClick={() => setView("board")}
          >
            Board
          </Button>
        </div>
      </div>

      <AddTodo />

      {view === "list" ? (
        <TodoList />
      ) : (
        <>
          <DragIndicator />
          <KanbanBoard />
        </>
      )}
    </main>
  );
}
