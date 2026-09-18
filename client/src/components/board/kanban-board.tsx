"use client";

import { useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useTodos, useSetTodoStatus } from "@/hooks/use-todos";
import { useBoardStore } from "@/lib/board-store";
import { COLUMNS, type Status } from "@/lib/types";
import { BoardColumn } from "./board-column";
import { CardFace } from "./board-card";
import { Layers } from "lucide-react";

function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="h-4 w-24 rounded bg-muted/60 animate-shimmer" />
            <div className="size-5 rounded bg-muted/60 animate-shimmer" />
          </div>
          <div className="min-h-[200px] rounded-xl border border-border/30 bg-muted/10 p-2.5">
            <div className="h-20 rounded-lg bg-muted/30 animate-shimmer mb-2" />
            <div className="h-20 rounded-lg bg-muted/30 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KanbanBoard() {
  const { data: todos, isLoading, error } = useTodos();
  const setStatus = useSetTodoStatus();
  const { activeTodoId, setActiveTodoId, setOverStatus } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const columns = useMemo(
    () =>
      COLUMNS.map((col) => ({
        ...col,
        todos: todos?.filter((t) => t.status === col.status) ?? [],
      })),
    [todos]
  );

  const activeTodo = todos?.find((t) => t.id === activeTodoId) ?? null;

  if (isLoading) return <BoardSkeleton />;

  if (error) {
    return (
      <div className="glass rounded-xl p-8 text-center animate-fade-in">
        <p className="text-destructive font-medium">Failed to load board</p>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <div className="glass rounded-xl p-12 text-center animate-fade-in-up">
        <Layers className="mx-auto size-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold text-foreground/80">
          Empty Board
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create some tasks to start organizing
        </p>
      </div>
    );
  }

  const clearDrag = () => {
    setActiveTodoId(null);
    setOverStatus(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveTodoId(Number(event.active.id));
  };

  const onDragOver = (event: DragOverEvent) => {
    setOverStatus(
      (event.over?.data.current?.status as Status | undefined) ?? null
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    clearDrag();
    const todo = todos?.find((t) => t.id === Number(event.active.id));
    const target = event.over?.data.current?.status as Status | undefined;
    if (!todo || !target || todo.status === target) return;
    setStatus.mutate({ id: todo.id, status: target });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={clearDrag}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <BoardColumn
            key={col.status}
            status={col.status}
            label={col.label}
            todos={col.todos}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
        {activeTodo ? (
          <div className="rotate-3 scale-105 opacity-90 shadow-2xl drop-shadow-xl transition-transform">
            <CardFace todo={activeTodo} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
