import { createServerFn } from "@tanstack/react-start";
import { NewNote, Note, notes } from "../db/schema";
import {
  addNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "~/db/db";
import { useAppSession } from "~/utils/session";

async function requireUserId() {
  const session = await useAppSession();
  const userId = session.data.userId;
  if (!userId) throw new Error("Not logged in");
  return userId;
}

export const readNotesServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const userId = await requireUserId();
    return getNotes(userId);
  }
);

export const readNoteByIdServer = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }): Promise<Note> => {
    const userId = await requireUserId();
    const note = await getNoteById(id);
    if (!note || note.userId !== userId) {
      throw new Error(`Note ${id} not found`);
    }
    return note;
  });

export const createNoteServer = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { title: string; body?: string; favorite?: boolean }) => input
  )
  .handler(async ({ data }) => {
    const userId = await requireUserId();
    const note: NewNote = {
      title: data.title,
      body: data.body ?? "",
      favorite: data.favorite ?? false,
      userId,
    };
    return addNote(note);
  });

export const updateNoteServer = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id: number; patch: Partial<typeof notes.$inferInsert> }) => input
  )
  .handler(async ({ data }) => {
    const userId = await requireUserId();
    return updateNote(userId, data.id, data.patch);
  });

export const deleteNoteServer = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    const userId = await requireUserId();
    return deleteNote(userId, id);
  });
