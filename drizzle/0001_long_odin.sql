PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notes_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_notes_table`("id", "title", "body", "favorite", "created_at") SELECT "id", "title", "body", "favorite", "created_at" FROM `notes_table`;--> statement-breakpoint
DROP TABLE `notes_table`;--> statement-breakpoint
ALTER TABLE `__new_notes_table` RENAME TO `notes_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;