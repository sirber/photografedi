import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    void (async () => {
      try {
        const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = rows[0];
        if (!user) {
          done(null, false, { message: 'Incorrect email.' });
          return;
        }

        const match = await bcrypt.compare(password, String(user.password));
        if (!match) {
          done(null, false, { message: 'Incorrect password.' });
          return;
        }

        done(null, user as Express.User);
      } catch (err) {
        done(err as Error);
      }
    })();
  })
);
