import { sql } from "drizzle-orm";
import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const notesTable = sqliteTable("notes_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  body: text("body").notNull().default(""),
  favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Note = typeof notesTable.$inferSelect;
export type NewNote = typeof notesTable.$inferInsert;
