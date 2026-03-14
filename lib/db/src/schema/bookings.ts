import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  userPhone: text("user_phone").notNull(),
  serviceDate: text("service_date").notNull(),
  serviceTime: text("service_time").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: real("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  isEmergency: boolean("is_emergency").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type BookingRow = typeof bookingsTable.$inferSelect;
