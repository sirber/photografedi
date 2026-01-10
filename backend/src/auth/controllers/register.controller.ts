import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as Record<string, unknown> | undefined;
    const username = body?.['username'];
    const email = body?.['email'];
    const password = body?.['password'];

    const minPasswordLen = Number(process.env.MIN_PASSWORD_LENGTH ?? 6);
    if (
      typeof username !== 'string' ||
      username.trim() === '' ||
      typeof email !== 'string' ||
      email.trim() === '' ||
      typeof password !== 'string' ||
      password.length < minPasswordLen
    ) {
      return res.status(400).json({
        ok: false,
        message: `Invalid input: username, email required and password must be at least ${minPasswordLen} characters`,
      });
    }

    // Check for existing by email or username
    const existingByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, String(email)))
      .limit(1);
    if (existingByEmail.length > 0)
      return res.status(409).json({ ok: false, message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const insertResult = await db
      .insert(users)
      .values({ username: String(username), email: String(email), password: hashed })
      .returning();
    const created = insertResult[0];

    req.logIn(created as Express.User, (err?: Error | null) => {
      if (err) return next(err);
      return res.json({ ok: true, user: { id: String(created?.id), email: created?.email } });
    });
  } catch (err) {
    return next(err as Error);
  }
}
