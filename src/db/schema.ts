import { sql } from "drizzle-orm";
import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const notesTable = sqliteTable("notes_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  body: text(),
  favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
