
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import session from "express-session";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false);
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth Routes
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      const existing = await storage.getUserByUsername(req.body.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  });

  // Middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Expenses Routes
  app.get(api.expenses.list.path, requireAuth, async (req, res) => {
    const expenses = await storage.getExpenses(req.user!.id);
    res.json(expenses);
  });

  app.post(api.expenses.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.expenses.create.input.parse(req.body);
      const expense = await storage.createExpense(req.user!.id, input);
      res.status(201).json(expense);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.expenses.delete.path, requireAuth, async (req, res) => {
    await storage.deleteExpense(Number(req.params.id), req.user!.id);
    res.sendStatus(204);
  });

  // Incomes Routes
  app.get(api.incomes.list.path, requireAuth, async (req, res) => {
    const incomes = await storage.getIncomes(req.user!.id);
    res.json(incomes);
  });

  app.post(api.incomes.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.incomes.create.input.parse(req.body);
      const income = await storage.createIncome(req.user!.id, input);
      res.status(201).json(income);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.incomes.delete.path, requireAuth, async (req, res) => {
    await storage.deleteIncome(Number(req.params.id), req.user!.id);
    res.sendStatus(204);
  });

  // Categories Routes
  app.get(api.categories.list.path, requireAuth, async (req, res) => {
    const categories = await storage.getCategories(req.user!.id);
    res.json(categories);
  });

  app.post(api.categories.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.categories.create.input.parse(req.body);
      const category = await storage.createCategory(req.user!.id, input);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Stats
  app.get(api.stats.summary.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const expenses = await storage.getExpenses(userId);
    const incomes = await storage.getIncomes(userId);

    // Convert numeric strings to numbers properly
    const totalExpense = expenses.reduce((sum, e) => {
      const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : Number(e.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const totalIncome = incomes.reduce((sum, i) => {
      const amount = typeof i.amount === 'string' ? parseFloat(i.amount) : Number(i.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const balance = totalIncome - totalExpense;

    const categoryMap = new Map<string, number>();
    expenses.forEach(e => {
      const catName = e.category?.name || 'Unknown';
      const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : Number(e.amount);
      const validAmount = isNaN(amount) ? 0 : amount;
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + validAmount);
    });

    const categoryWise = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

    res.json({
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      balance: balance.toFixed(2),
      categoryWise,
    });
  });

  // Seed default categories
  await storage.seedCategories();

  return httpServer;
}
