import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workersTable = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: text("category_id").notNull(),
  experience: integer("experience").notNull(),
  pricePerHour: real("price_per_hour").notNull(),
  serviceArea: text("service_area").notNull(),
  bio: text("bio").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  isAvailableEmergency: boolean("is_available_emergency").notNull().default(false),
  isOnline: boolean("is_online").notNull().default(true),
  avatarUrl: text("avatar_url"),
  skills: text("skills").array().notNull().default([]),
  completedJobs: integer("completed_jobs").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWorkerSchema = createInsertSchema(workersTable).omit({ id: true, createdAt: true });
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type WorkerRow = typeof workersTable.$inferSelect;
