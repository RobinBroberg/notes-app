import { queryOptions } from "@tanstack/react-query";
import {
  Note,
  readNoteByIdServer,
  readNotes,
  readNotesServer,
} from "~/api/notes";

export const notesListQueryOptions = () =>
  queryOptions<Note[]>({
    queryKey: ["notes"],
    queryFn: () => readNotesServer(),
  });

export const noteByIdQueryOptions = (id: number) =>
  queryOptions<Note>({
    queryKey: ["note", id],
    queryFn: () => readNoteByIdServer({ data: id }),
  });
