import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc, and } from "drizzle-orm";
import { NewNote, Note, notes } from "./schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  connectionLimit: 10,
});

export const db = drizzle({ client: pool });

export async function getNotes(userId: number) {
  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.createdAt));
}

export async function addNote(note: NewNote) {
  const [insertedNote] = await db.insert(notes).values(note);
  const id = insertedNote.insertId;

  const noteResult = await db.select().from(notes).where(eq(notes.id, id));

  return noteResult[0];
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  const [row] = await db.select().from(notes).where(eq(notes.id, id));
  return row;
}

export async function updateNote(userId: number, id: number, patch: any) {
  await db
    .update(notes)
    .set(patch)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

export async function deleteNote(userId: number, id: number) {
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}
