import { sql } from "drizzle-orm";
import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const calendarEvents = sqliteTable(
  "calendar_events",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    startAt: text("start_at").notNull(),
    category: text("category").notNull(),
    payload: text("payload").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_calendar_events_slug").on(table.slug),
    index("idx_calendar_events_start_at").on(table.startAt),
  ],
);

export const calendarEventDeletions = sqliteTable("calendar_event_deletions", {
  id: text("id").primaryKey(),
  deletedAt: text("deleted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const calendarMeta = sqliteTable("calendar_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
