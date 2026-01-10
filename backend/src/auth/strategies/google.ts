import passport from 'passport';
import type { Profile } from 'passport';
import { Strategy as GoogleStrategy, type VerifyCallback } from 'passport-google-oauth20';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async function (
        accessToken: string,
        refreshToken: string | undefined,
        profile: Profile,
        done: VerifyCallback
      ) {
        try {
          const email = profile?.emails?.[0]?.value;
          const providerId = profile?.id;

          // Try find by provider id using JSONB path, fallback to email
          const rows = await db
            .select()
            .from(users)
            .where(sql`providers->'google'->>'id' = ${providerId}`)
            .limit(1);
          let user = rows[0];

          if (!user && email) {
            const byEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
            user = byEmail[0];
          }

          if (!user) {
            const providersObj: Record<string, unknown> = { google: { id: providerId, profile } };
            const insert = await db
              .insert(users)
              .values({
                username: email || `google-${providerId}`,
                email: email || '',
                password: '',
                providers: providersObj,
              })
              .returning();
            user = insert[0];
          } else {
            // merge providers object
            const existingProviders = (user.providers as Record<string, unknown> | null) ?? {};
            const merged = { ...existingProviders, google: { id: providerId, profile } };
            await db
              .update(users)
              .set({ providers: merged as Record<string, unknown> })
              .where(eq(users.id, user.id));
            // reload user
            const reloaded = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
            user = reloaded[0];
          }

          done(null, user as Express.User);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          done(error);
        }
      }
    )
  );
}
