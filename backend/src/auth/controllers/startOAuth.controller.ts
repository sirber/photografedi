import type { Request, Response, NextFunction } from 'express';
import passport from '@/auth/passport';

const ALLOWED_PROVIDERS = ['google', 'microsoft'] as const;

const isProvider = (p: string): p is (typeof ALLOWED_PROVIDERS)[number] =>
  (ALLOWED_PROVIDERS as readonly string[]).includes(p);

export default function startOAuth(req: Request, res: Response, next: NextFunction) {
  const provider = String(req.params.provider || '');
  if (!isProvider(provider)) return res.status(404).send('Unknown provider');

  const opts =
    provider === 'google'
      ? { scope: ['profile', 'email'], state: JSON.stringify({ ts: Date.now() }) }
      : { scope: ['openid', 'profile', 'email'], state: JSON.stringify({ ts: Date.now() }) };

  return passport.authenticate(provider, opts)(req, res, next);
}
