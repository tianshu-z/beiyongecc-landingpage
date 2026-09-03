CREATE UNIQUE INDEX `idx_calendar_events_slug` ON `calendar_events` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_calendar_events_start_at` ON `calendar_events` (`start_at`);