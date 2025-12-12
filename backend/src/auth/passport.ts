import passport from 'passport';
import { User } from '../user/models/user.model';
import type { UserInterface } from '../user/types/user.interface';
import './strategies/local';
import './strategies/google';
import './strategies/microsoft';

passport.serializeUser(function (user: Express.User | UserInterface, done) {
  // store the user id in the session
  const uObj = user as Record<string, unknown> | undefined;
  let id: unknown;
  if (uObj && typeof uObj === 'object') {
    if ('_id' in uObj) id = uObj['_id'];
    else if ('id' in uObj) id = uObj['id'];
  }
  if (id === undefined) id = user;
  if (typeof id !== 'string' && typeof id !== 'number') id = String(id);
  done(null, String(id));
});

passport.deserializeUser(async function (id: string, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user as UserInterface | null);
  } catch (err) {
    done(err as Error);
  }
});

export default passport;
