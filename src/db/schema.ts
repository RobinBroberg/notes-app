import { sql } from "drizzle-orm";
import {
  mysqlTable,
  timestamp,
  varchar,
  int,
  text,
  boolean,
} from "drizzle-orm/mysql-core";

export const notesTable = mysqlTable("notes_table", {
  id: int().primaryKey().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  body: text().notNull().default(""),
  favorite: boolean("favorite").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Note = typeof notesTable.$inferSelect;
export type NewNote = typeof notesTable.$inferInsert;
