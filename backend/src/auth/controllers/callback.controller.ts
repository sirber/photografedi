import type { Request, Response, NextFunction } from 'express';
import passport from '@/auth/passport';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export default function callbackOAuth(req: Request, res: Response, next: NextFunction) {
  const provider = String(req.params.provider || '');

  return passport.authenticate(
    provider,
    { failureRedirect: `${FRONTEND_URL}/login`, session: true },
    (err: Error | null, user: Express.User | false | null) => {
      if (err) return next(err);
      if (!user) return res.redirect(`${FRONTEND_URL}/login`);

      req.logIn(user, (err?: Error | null) => {
        if (err) return next(err);
        return res.redirect(FRONTEND_URL);
      });
    }
  )(req, res, next);
}
