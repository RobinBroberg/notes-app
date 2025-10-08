import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { NewNote, Note, notesTable } from "./schema";

const sqlite = new Database(process.env.DB_FILE_NAME ?? "file.local.db");
export const db = drizzle(sqlite, { schema: { notesTable } });

export function getNotes() {
  return db.select().from(notesTable).all();
}

export function addNote(input: NewNote): Note {
  return db.insert(notesTable).values(input).returning().get();
}

export function getNoteById(id: number): Note | undefined {
  return db.select().from(notesTable).where(eq(notesTable.id, id)).get();
}

export function updateNote(
  id: number,
  patch: Partial<typeof notesTable.$inferInsert>
): Note {
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
