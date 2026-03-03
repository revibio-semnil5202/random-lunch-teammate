import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  department: varchar("department", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  matchedAt: date("matched_at").defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .references(() => groups.id)
    .notNull(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
});
