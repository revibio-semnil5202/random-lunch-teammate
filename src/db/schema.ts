import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  date,
  jsonb,
} from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 10 }).notNull(),
  department: varchar("department", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groupConfigs = pgTable("group_configs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  schedule: jsonb("schedule").notNull().$type<string[]>(),
  maxParticipants: integer("max_participants").notNull(),
  matchDeadlineTime: varchar("match_deadline_time", { length: 5 }).notNull(),
  slackChannelUrl: varchar("slack_channel_url", { length: 500 }),
  slackWebhookUrl: varchar("slack_webhook_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lunchEvents = pgTable("lunch_events", {
  id: serial("id").primaryKey(),
  groupConfigId: integer("group_config_id")
    .references(() => groupConfigs.id)
    .notNull(),
  lunchDate: date("lunch_date").notNull(),
  matchDeadline: timestamp("match_deadline").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("recruiting"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => lunchEvents.id)
    .notNull(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matchResults = pgTable("match_results", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => lunchEvents.id)
    .notNull(),
  matchGroupIndex: integer("match_group_index").notNull(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
