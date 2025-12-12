import passport from 'passport';
import type { Profile } from 'passport';
import { Strategy as GoogleStrategy, type VerifyCallback } from 'passport-google-oauth20';
import { User } from '../../user/models/user.model';
import type { UserInterface } from '../../user/types/user.interface';

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
          const email = profile?.emails?.[0]?.value as string | undefined;
          const providerId = profile?.id;

          // Try find by provider id
          let user = await User.findOne({ 'providers.google.id': providerId }).exec();
          if (!user && email) {
            // Try find by verified email
            user = await User.findOne({ email }).exec();
          }

          if (!user) {
            user = new User({
              username: email || `google-${providerId}`,
              email: email || '',
              password: '',
              providers: { google: { id: providerId, profile } },
            } as Partial<UserInterface>);
            await user.save();
          } else {
            user.set(`providers.google`, { id: providerId, profile });
            await user.save();
          }

          done(null, user);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          done(error);
        }
      }
    )
  );
}
