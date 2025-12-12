import type { Request, Response } from 'express';
import Post from '../models/post.model';
import parsePagination from '../utils/paginate';

export async function userFeed(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const { limit, skip } = parsePagination(req);

    const posts = await Post.find({ actor: username })
      .sort({ published: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return res.json({ ok: true, data: posts });
  } catch {
    return res.status(500).json({ ok: false, error: 'Failed to load user feed' });
  }
}
