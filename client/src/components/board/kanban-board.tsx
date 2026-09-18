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

  if (isLoading) return <p>Loading board…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const clearDrag = () => {
    setActiveTodoId(null);
    setOverStatus(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveTodoId(Number(event.active.id));
  };

  const onDragOver = (event: DragOverEvent) => {
    setOverStatus((event.over?.data.current?.status as Status | undefined) ?? null);
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

      <DragOverlay>
        {activeTodo ? (
          <div className="rotate-2 scale-105 opacity-90">
            <CardFace todo={activeTodo} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
