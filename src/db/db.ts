import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { desc, eq } from "drizzle-orm";
import { notesTable } from "./schema";

export type NoteRow = typeof notesTable.$inferSelect;
const sqlite = new Database(process.env.DB_FILE_NAME ?? "file.local.db");
export const db = drizzle(sqlite, { schema: { notesTable } });

export function getNotes() {
  return db.select().from(notesTable).orderBy(desc(notesTable.createdAt)).all();
}

export function addNote(input: {
  title: string;
  body?: string;
  favorite?: boolean;
}) {
  return db
    .insert(notesTable)
    .values({
      title: input.title,
      body: input.body ?? null,
      favorite: input.favorite ?? false,
    })
    .returning()
    .get();
}

export function getNoteById(id: number): NoteRow | undefined {
  return db.select().from(notesTable).where(eq(notesTable.id, id)).get();
}

export function updateNote(
  id: number,
  patch: Partial<typeof notesTable.$inferInsert>
): NoteRow {
  const updated = db
    .update(notesTable)
    .set(patch)
    .where(eq(notesTable.id, id))
    .returning()
    .get();

  if (!updated) throw new Error(`Note ${id} not found`);
  return updated;
}

export function deleteNote(id: number): { ok: true } {
  const deleted = db
    .delete(notesTable)
    .where(eq(notesTable.id, id))
    .returning({ id: notesTable.id })
    .get();

  if (!deleted) throw new Error(`Note ${id} not found`);
  return { ok: true };
}
