import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

// this is kinda useless but im too lazy to fix it
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Clients
export const clients = createTable("client", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }),
});

// Define the relations for clients
export const clientsRelations = relations(clients, ({ one }) => ({
  projects: one(projects, {
    fields: [clients.id],
    references: [projects.clientId],
  }), // A client can have multiple projects
}));

export const clientFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

// Projects
export const projects = createTable("projects", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  notes: jsonb("notes"),
  startDate: varchar("start_date", { length: 10 }),
  endDate: varchar("end_date", { length: 10 }),
});

// Define the relations for projects
export const projectsRelations = relations(projects, ({ one }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }), // Each project belongs to one client
  payments: one(payments, {
    fields: [projects.id],
    references: [payments.projectId],
  }), // A project can have multiple payments
}));

export const projectFormSchema = z.object({
  clientId: z.number().int().positive("Client ID must be a positive integer"),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

// Payments
export const payments = createTable("payments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  amount: integer("amount").notNull(),
  description: varchar("description"),
  date: varchar("date", { length: 10 }),
  paymentType: varchar("payment_type", { length: 20 }).notNull(), // "one-time" or "recurring"
  recurringFrequency: varchar("recurring_frequency", { length: 20 }), // "yearly", "monthly" (nullable)
  paymentStatus: integer("payment_status").notNull(),
});

// Define the relations for payments
export const paymentsRelations = relations(payments, ({ one }) => ({
  project: one(projects, {
    fields: [payments.projectId],
    references: [projects.id],
  }), // Each payment is associated with one project
}));

export const paymentFormSchema = z.object({
  projectId: z.number().int().positive("Project ID must be a positive integer"),
  amount: z.number().positive("Amount must be a positive number"),
  date: z.string().optional().nullable(),
  paymentType: z.string(),
  description: z.string(),
  recurringFrequency: z.string().optional().nullable(),
  paymentStatus: z.number(),
});

// Logs
export const logs = createTable("log", {
  id: serial("id").primaryKey(),
  project: varchar("project", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  message: varchar("message", { length: 255 }),
  errorMessage: varchar("error_message", { length: 255 }),
  action: varchar("action", { length: 50 }),
});

export const logSchema = z.object({
  project: z.string().min(1, "Project is required"),
  status: z
    .enum(["failed", "success"])
    .refine((val) => ["failed", "success"].includes(val), {
      message: "Status must be either 'failed' or 'success'",
    }),
  message: z.string(),
  errorMessage: z.string().optional(),
  action: z.string().min(1, "Action is required"),
});
