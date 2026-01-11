import passport from 'passport';
import type { Profile } from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { v7 } from 'uuid';

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';

if (MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: MICROSOFT_CLIENT_ID,
        clientSecret: MICROSOFT_CLIENT_SECRET,
        callbackURL: '/auth/microsoft/callback',
        scope: ['user.read'],
      },
      function (
        _accessToken: string,
        _refreshToken: string | undefined,
        profile: Profile,
        done: (err: Error | null, user?: Express.User | false | null) => void
      ) {
        (async () => {
          try {
            const email = profile?.emails?.[0]?.value;
            const providerId = profile?.id;

            const rows = await db
              .select()
              .from(users)
              .where(sql`providers->'microsoft'->>'id' = ${providerId}`)
              .limit(1);
            let user = rows[0];

            if (!user && email) {
              const byEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
              user = byEmail[0];
            }

            if (!user) {
              type NewUser = InferInsertModel<typeof users>;
              const providersObj = { microsoft: { id: providerId, profile } };
              const newUser: NewUser = {
                id: v7(),
                preferred_username: (email as string) || `ms-${providerId}`,
                email: email || '',
                password: '',
                providers: providersObj,
              };
              const insert = await db.insert(users).values(newUser).returning();
              user = insert[0];
            } else {
              const existingProviders = (user.providers as Record<string, unknown> | null) ?? {};
              const merged = { ...existingProviders, microsoft: { id: providerId, profile } };
              await db
                .update(users)
                .set({ providers: merged as Record<string, unknown> })
                .where(eq(users.id, user.id));
              const reloaded = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
              user = reloaded[0];
            }

            done(null, user as Express.User);
          } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error(String(err));
            done(error);
          }
        })().catch((err: unknown) => {
          const error = err instanceof Error ? err : new Error(String(err));
          done(error);
        });
      }
    )
  );
}
