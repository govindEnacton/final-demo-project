import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { todos } from "./db/schema";

type Todo = typeof todos.$inferSelect;
type NewTodo = typeof todos.$inferInsert;
type TodoInput = Partial<Pick<NewTodo, "title" | "completed">>;

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => c.text("todo API is up"));

app.get("/todos", async (c) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("3 second break completed");
      resolve('nothin');
    }, 3000);
  });

  const rows: Todo[] = await db.select().from(todos).orderBy(todos.createdAt);
  return c.json(rows);
});

app.post("/todos", async (c) => {
  const body = await c.req.json<TodoInput>().catch(() => null);

  if (!body || typeof body.title !== "string" || body.title.trim() === "") {
    return c.json({ error: "'title' (non-empty string) is required" }, 400);
  }

  const rows: Todo[] = await db
    .insert(todos)
    .values({ title: body.title.trim() })
    .returning();

  const created = rows[0];
  if (!created) {
    return c.json({ error: "failed to create todo" }, 500);
  }

  return c.json(created, 201);
});

app.patch("/todos/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) {
    return c.json({ error: "invalid id" }, 400);
  }

  const body = await c.req.json<TodoInput>().catch(() => null);
  if (!body || (body.title === undefined && body.completed === undefined)) {
    return c.json({ error: "nothing to update" }, 400);
  }

  const updates: TodoInput = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.completed === "boolean") updates.completed = body.completed;

  const rows: Todo[] = await db
    .update(todos)
    .set(updates)
    .where(eq(todos.id, id))
    .returning();

  const updated = rows[0];
  if (!updated) {
    return c.json({ error: `todo ${id} not found` }, 404);
  }

  return c.json(updated);
});

app.delete("/todos/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) {
    return c.json({ error: "invalid id" }, 400);
  }

  const rows: Todo[] = await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning();

  if (!rows[0]) {
    return c.json({ error: `todo ${id} not found` }, 404);
  }

  return c.json({ ok: true });
});

const port = Number(process.env["PORT"]) || 3000;

Bun.serve({ port, fetch: app.fetch });
console.log(`API running on http://localhost:${port}`);
