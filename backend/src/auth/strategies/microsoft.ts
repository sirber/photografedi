import passport from 'passport';
import type { Profile } from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { User } from '../../user/models/user.model';
import type { UserInterface } from '../../user/types/user.interface';

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
      async function (
        accessToken: string,
        refreshToken: string | undefined,
        profile: Profile,
        done: (err: Error | null, user?: Express.User | false | null) => void
      ) {
        try {
          const email = profile?.emails?.[0]?.value as string | undefined;
          const providerId = profile?.id;

          let user = await User.findOne({ 'providers.microsoft.id': providerId }).exec();
          if (!user && email) user = await User.findOne({ email }).exec();

          if (!user) {
            user = new User({
              username: email || `ms-${providerId}`,
              email: email || '',
              password: '',
              providers: { microsoft: { id: providerId, profile } },
            } as Partial<UserInterface>);
            await user.save();
          } else {
            user.set(`providers.microsoft`, { id: providerId, profile });
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
