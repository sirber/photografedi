import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './types';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Passport attaches isAuthenticated; use it if available
  const isAuth = req.isAuthenticated?.() ?? false;

  if (isAuth || req.user?.username) return next();

  return res.status(401).json({ ok: false, error: 'Authentication required' });
}

export default requireAuth;
