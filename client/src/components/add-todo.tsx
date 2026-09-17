"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

async function addTodoRequest(title: string): Promise<Todo> {
  const res = await fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Failed to add: ${res.status}`);
  return res.json();
}

export function AddTodo() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const addTodo = useMutation({
    mutationFn: addTodoRequest,
    onSuccess: () => {
      // tell React Query the ["todos"] list is stale → it refetches → UI updates
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || addTodo.isPending) return;
    addTodo.mutate(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a todo…"
        disabled={addTodo.isPending}
      />
      <Button type="submit" disabled={!title.trim() || addTodo.isPending}>
        {addTodo.isPending ? "Adding…" : "Add"}
      </Button>
      {addTodo.isError && (
        <p className="text-sm text-red-500">{addTodo.error.message}</p>
      )}
    </form>
  );
}
