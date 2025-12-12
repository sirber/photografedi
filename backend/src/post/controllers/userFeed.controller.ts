import type { Response } from 'express';
import Post from '../models/post.model';
import parsePagination from '../utils/paginate';
import type { AuthRequest } from '../../auth/types';

export async function userFeed(req: AuthRequest, res: Response) {
  try {
    const { username: paramUsername } = req.params;
    const authUsername = req.user?.username;
    const username = authUsername ?? paramUsername;
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
