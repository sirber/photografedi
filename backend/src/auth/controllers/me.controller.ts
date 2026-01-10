import type { Request, Response } from 'express';

export default function meController(req: Request, res: Response) {
  if (!req.user) return res.status(200).json({ ok: false });

  const maybeUser = req.user;
  if (!maybeUser || typeof maybeUser !== 'object') return res.status(500).json({ ok: false });

  const u: { id?: string; email?: string } = {};
  const uObj = maybeUser as Record<string, unknown>;
  if ('id' in uObj) u.id = String(uObj['id']);
  if ('email' in uObj && typeof uObj['email'] === 'string') u.email = uObj['email'];

  return res.json({ ok: true, user: u });
}
