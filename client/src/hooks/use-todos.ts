"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "@/lib/api";
import type { Todo } from "@/lib/types";

export function useTodos() {
  return useQuery({ queryKey: ["todos"], queryFn: todoApi.list });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      todoApi.toggle(id, completed),

    // OPTIMISTIC: update the cache BEFORE the server answers
    onMutate: async ({ id, completed }) => {
      // 1. stop any in-flight refetch from overwriting our optimistic write
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // 2. snapshot the cache so we can roll back on failure
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);

      // 3. write the expected result straight into the cache → UI flips instantly
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) => (t.id === id ? { ...t, completed } : t))
      );

      // 4. whatever you return here arrives as `context` in onError
      return { previous };
    },

    onError: (_err, _vars, context) => {
      // server rejected → put the old data back
      if (context?.previous) {
        queryClient.setQueryData(["todos"], context.previous);
      }
    },

    onSettled: () => {
      // success or failure → resync with the server as the final word
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoApi.remove(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) => old?.filter((t) => t.id !== id));
      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["todos"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
