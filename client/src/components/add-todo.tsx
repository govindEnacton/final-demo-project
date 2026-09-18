"use client";

import { useState, useRef } from "react";
import { useAddTodo } from "@/hooks/use-todos";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

export function AddTodo() {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addTodo = useAddTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || addTodo.isPending) return;
    addTodo.mutate(trimmed, {
      onSuccess: () => {
        setTitle("");
        inputRef.current?.focus();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-xl p-1.5 animate-fade-in-up"
      style={{ animationDelay: "80ms" }}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={addTodo.isPending}
            className="h-11 rounded-lg border-none bg-transparent pl-4 pr-4 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-none"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || addTodo.isPending}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/80 hover:shadow-md hover:shadow-primary/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3.5"
        >
          {addTodo.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          <span className="hidden text-sm font-medium sm:inline">Add</span>
        </button>
      </div>
      {addTodo.isError && (
        <p className="mt-2 px-3 pb-1 text-xs text-destructive animate-fade-in">
          {addTodo.error.message}
        </p>
      )}
    </form>
  );
}
