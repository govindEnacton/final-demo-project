import { create } from "zustand";

export type Filter = "all" | "open" | "done";

type TodoUiState = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const useTodoUiStore = create<TodoUiState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
}));
