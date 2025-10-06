import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";

import { notesTable } from "../db/schema";
import {
  addNote,
  db,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "~/db/db";

export type Note = typeof notesTable.$inferSelect;

export const readNotesServer = createServerFn({ method: "GET" }).handler(
  async () => getNotes()
);

export const readNoteByIdServer = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }): Promise<Note> => {
    const note = getNoteById(id);
    if (!note) throw new Error(`Note ${id} not found`);
    return note;
  });

export const createNoteServer = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { title: string; body?: string; favorite?: boolean }) => input
  )
  .handler(async ({ data }) => {
    return addNote(data);
  });

export const updateNoteServer = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id: number; patch: Partial<typeof notesTable.$inferInsert> }) =>
      input
  )
  .handler(async ({ data }) => updateNote(data.id, data.patch));

export const deleteNoteServer = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => deleteNote(id));
