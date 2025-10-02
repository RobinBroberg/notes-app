import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { notesListQueryOptions } from "~/utils/notes";

export const Route = createFileRoute("/notes")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(notesListQueryOptions());
  },
  head: () => ({
    meta: [{ title: "Notes" }],
  }),
  component: NotesComponent,
});

function NotesComponent() {
  const notesQuery = useSuspenseQuery(notesListQueryOptions());
  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {notesQuery.data.map((note) => (
          <li key={note.id} className="whitespace-nowrap">
            <Link
              to="/notes/$id"
              params={{ id: String(note.id) }}
              className="block py-1 text-blue-800 hover:text-blue-600"
              activeProps={{ className: "text-black font-bold" }}
            >
              <div>{note.title}</div>
            </Link>
          </li>
        ))}
      </ul>

      <hr />
      <Outlet />
    </div>
  );
}
