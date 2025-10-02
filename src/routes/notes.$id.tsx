import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { noteByIdQueryOptions } from "~/utils/notes";

export const Route = createFileRoute("/notes/$id")({
  loader: async ({ context, params }) => {
    const id = Number(params.id);
    await context.queryClient.ensureQueryData(noteByIdQueryOptions(id));
  },
  component: NoteComponent,
});

function NoteComponent() {
  const { id: idParam } = Route.useParams();
  const id = Number(idParam);

  const noteQuery = useSuspenseQuery(noteByIdQueryOptions(id));
  const note = noteQuery.data;

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold">{note?.title}</h2>
      {note?.body && <p className="mt-2">{note?.body}</p>}
      <p className="mt-2 text-sm">Favorite: {note?.favorite ? "Yes" : "No"}</p>
    </div>
  );
}
