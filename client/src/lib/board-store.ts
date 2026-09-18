import { create } from "zustand";
import type { Status } from "@/lib/types";

type BoardState = {
  activeTodoId: number | null;
  overStatus: Status | null;
  setActiveTodoId: (id: number | null) => void;
  setOverStatus: (status: Status | null) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  activeTodoId: null,
  overStatus: null,
  setActiveTodoId: (id) => set({ activeTodoId: id }),
  setOverStatus: (status) => set({ overStatus: status }),
}));
