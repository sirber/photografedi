import type { Request, Response } from 'express';
import Post from '../models/post.model';
import parsePagination from '../utils/paginate';

export async function federatedFeed(req: Request, res: Response) {
  try {
    const { limit, skip } = parsePagination(req);

    // Federated feed: public posts including remote actors
    const posts = await Post.find({ visibility: 'public' })
      .sort({ published: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ ok: true, data: posts });
  } catch {
    return res.status(500).json({ ok: false, error: 'Failed to load federated feed' });
  }
}
