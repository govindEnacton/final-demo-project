import type { Todo } from "@/lib/types";

const API_URL = "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} failed: ${res.status}`);
  }
  return res.json();
}

export const todoApi = {
  list: () => request<Todo[]>("/todos"),
  add: (title: string) =>
    request<Todo>("/todos", { method: "POST", body: JSON.stringify({ title }) }),
  toggle: (id: number, completed: boolean) =>
    request<Todo>(`/todos/${id}`, { method: "PATCH", body: JSON.stringify({ completed }) }),
  remove: (id: number) =>
    request<{ ok: boolean }>(`/todos/${id}`, { method: "DELETE" }),
};
