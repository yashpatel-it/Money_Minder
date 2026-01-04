
import { 
  users, expenses, incomes, categories,
  type User, type InsertUser,
  type Expense, type InsertExpense,
  type Income, type InsertIncome,
  type Category, type InsertCategory
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getExpenses(userId: number): Promise<(Expense & { category: Category | null })[]>;
  createExpense(userId: number, expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: number, userId: number): Promise<void>;

  getIncomes(userId: number): Promise<Income[]>;
  createIncome(userId: number, income: InsertIncome): Promise<Income>;
  deleteIncome(id: number, userId: number): Promise<void>;

  getCategories(userId: number): Promise<Category[]>;
  createCategory(userId: number, category: InsertCategory): Promise<Category>;
  
  sessionStore: session.Store;
  seedCategories(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getExpenses(userId: number): Promise<(Expense & { category: Category | null })[]> {
    return await db.select({
      id: expenses.id,
      userId: expenses.userId,
      amount: expenses.amount,
      date: expenses.date,
      categoryId: expenses.categoryId,
      paymentMode: expenses.paymentMode,
      description: expenses.description,
      category: categories,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));
  }

  async createExpense(userId: number, expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values({ ...expense, userId }).returning();
    return newExpense;
  }

  async deleteExpense(id: number, userId: number): Promise<void> {
    await db.delete(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId)));
  }

  async getIncomes(userId: number): Promise<Income[]> {
    return await db.select().from(incomes).where(eq(incomes.userId, userId)).orderBy(desc(incomes.date));
  }

  async createIncome(userId: number, income: InsertIncome): Promise<Income> {
    const [newIncome] = await db.insert(incomes).values({ ...income, userId }).returning();
    return newIncome;
  }

  async deleteIncome(id: number, userId: number): Promise<void> {
    await db.delete(incomes).where(and(eq(incomes.id, id), eq(incomes.userId, userId)));
  }

  async getCategories(userId: number): Promise<Category[]> {
    return await db.select().from(categories).where(
      sql`(${categories.userId} IS NULL OR ${categories.userId} = ${userId})`
    );
  }

  async createCategory(userId: number, category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values({ ...category, userId }).returning();
    return newCategory;
  }

  async seedCategories(): Promise<void> {
    const existing = await db.select().from(categories).limit(1);
    if (existing.length === 0) {
      const defaults = [
        { name: "Food", type: "expense", isDefault: true },
        { name: "Travel", type: "expense", isDefault: true },
        { name: "Rent", type: "expense", isDefault: true },
        { name: "Education", type: "expense", isDefault: true },
        { name: "Medical", type: "expense", isDefault: true },
        { name: "Entertainment", type: "expense", isDefault: true },
        { name: "Other", type: "expense", isDefault: true },
        { name: "Salary", type: "income", isDefault: true },
        { name: "Pocket Money", type: "income", isDefault: true },
        { name: "Freelancing", type: "income", isDefault: true },
        { name: "Other", type: "income", isDefault: true },
      ];
      await db.insert(categories).values(defaults);
    }
  }
}

export const storage = new DatabaseStorage();
