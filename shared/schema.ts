
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'expense' or 'income'
  isDefault: boolean("is_default").default(false),
  userId: integer("user_id").references(() => users.id), // Null for system defaults
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  date: timestamp("date").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  paymentMode: text("payment_mode").notNull(), // Cash, UPI, Card, Bank Transfer
  description: text("description"),
});

export const incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  date: timestamp("date").notNull(),
  source: text("source").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCategorySchema = createInsertSchema(categories);
export const insertExpenseSchema = createInsertSchema(expenses)
  .omit({ id: true, userId: true })
  .extend({
    amount: z.union([z.string(), z.number()]).transform(val => {
      if (typeof val === 'number') return val.toString();
      return val;
    }),
    date: z.union([z.date(), z.string()]).transform(val => {
      if (typeof val === 'string') return new Date(val);
      return val;
    }),
    categoryId: z.union([z.string(), z.number()]).transform(val => {
      if (typeof val === 'string') return parseInt(val, 10);
      return val;
    }),
  });
export const insertIncomeSchema = createInsertSchema(incomes)
  .omit({ id: true, userId: true })
  .extend({
    amount: z.union([z.string(), z.number()]).transform(val => {
      if (typeof val === 'number') return val.toString();
      return val;
    }),
    date: z.union([z.date(), z.string()]).transform(val => {
      if (typeof val === 'string') return new Date(val);
      return val;
    }),
  });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Income = typeof incomes.$inferSelect;
export type InsertIncome = z.infer<typeof insertIncomeSchema>;

// API Request Types
export type CreateExpenseRequest = InsertExpense;
export type CreateIncomeRequest = InsertIncome;
export type CreateCategoryRequest = InsertCategory;
