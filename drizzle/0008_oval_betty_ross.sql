CREATE TABLE `menus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image_url` text,
	`redirect_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer
);
