import type { Request } from 'express';

export function parsePagination(req: Request) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
  const page = Math.max(0, Number(req.query.page) || 0);
  return { limit, skip: page * limit };
}

export default parsePagination;
