import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc } from "drizzle-orm";
import { NewNote, Note, notesTable } from "./schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  connectionLimit: 10,
});

export const db = drizzle({ client: pool });

export async function getNotes(): Promise<Note[]> {
  return await db.select().from(notesTable).orderBy(desc(notesTable.createdAt));
}

export async function addNote(note: NewNote) {
  const [insertedNote] = await db.insert(notesTable).values(note);
  const id = insertedNote.insertId;

  const noteResult = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, id));

  return noteResult[0];
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  const [row] = await db.select().from(notesTable).where(eq(notesTable.id, id));
  return row;
}

export async function updateNote(
  id: number,
  patch: Partial<NewNote>
): Promise<Note> {
  await db.update(notesTable).set(patch).where(eq(notesTable.id, id));
  const [row] = await db.select().from(notesTable).where(eq(notesTable.id, id));
  return row;
}

export async function deleteNote(id: number): Promise<{ ok: true }> {
  await db.delete(notesTable).where(eq(notesTable.id, id));
  return { ok: true };
}
