import passport from 'passport';
import './strategies/local';
import './strategies/google';
import './strategies/microsoft';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

passport.serializeUser(function (user: Express.User, done) {
  // Expect `user` to contain an `id` property from the database result.
  const uObj = user as Record<string, unknown> | undefined;
  let id: unknown = undefined;
  if (uObj && typeof uObj === 'object') {
    if ('id' in uObj) id = uObj['id'];
  }
  if (id === undefined) id = user;
  if (typeof id !== 'string' && typeof id !== 'number') id = String(id);
  done(null, String(id));
});

passport.deserializeUser(async function (id: string, done) {
  try {
    const row = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);
    const user = row[0] ?? null;
    done(null, user);
  } catch (err) {
    done(err as Error);
  }
});

export default passport;
