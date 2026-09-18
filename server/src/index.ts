import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { todos } from "./db/schema";

type Todo = typeof todos.$inferSelect;
type NewTodo = typeof todos.$inferInsert;

const STATUSES = ["todo", "in_progress", "done"] as const;
type Status = (typeof STATUSES)[number];

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => c.text("todo API is up"));

app.get("/todos", async (c) => {
console.log("reached here!")
  const rows: Todo[] = await db.select().from(todos).orderBy(todos.createdAt);
  return c.json(rows);
});

app.post("/todos", async (c) => {
  const body = await c.req.json<{ title?: unknown; status?: unknown }>().catch(() => null);

  if (!body || typeof body.title !== "string" || body.title.trim() === "") {
    return c.json({ error: "'title' (non-empty string) is required" }, 400);
  }

  const values: NewTodo = { title: body.title.trim() };
  if (isStatus(body.status)) values.status = body.status; // optional in POST

  const rows: Todo[] = await db.insert(todos).values(values).returning();

  const created = rows[0];
  if (!created) return c.json({ error: "failed to create todo" }, 500);

  return c.json(created, 201);
});

app.patch("/todos/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "invalid id" }, 400);

  const body = await c.req.json<{ title?: unknown; status?: unknown }>().catch(() => null);
  if (!body) return c.json({ error: "invalid JSON body" }, 400);

  const updates: Partial<Pick<NewTodo, "title" | "status">> = {};
  if (typeof body.title === "string" && body.title.trim() !== "") {
    updates.title = body.title.trim();
  }
  if (isStatus(body.status)) {
    updates.status = body.status;
  }
  if (Object.keys(updates).length === 0) {
    return c.json({ error: "nothing to update — send 'title' and/or 'status'" }, 400);
  }

  const rows: Todo[] = await db.update(todos).set(updates).where(eq(todos.id, id)).returning();
  const updated = rows[0];
  if (!updated) return c.json({ error: `todo ${id} not found` }, 404);

  return c.json(updated);
});

app.delete("/todos/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "invalid id" }, 400);

  const rows: Todo[] = await db.delete(todos).where(eq(todos.id, id)).returning();
  if (!rows[0]) return c.json({ error: `todo ${id} not found` }, 404);

  return c.json({ ok: true });
});

const port = Number(process.env["PORT"]) || 3000;
Bun.serve({ port, fetch: app.fetch });
console.log(`API running on http://localhost:${port}`);
