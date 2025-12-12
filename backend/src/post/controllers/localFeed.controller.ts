import type { Request, Response } from 'express';
import Post from '../models/post.model';
import parsePagination from '../utils/paginate';

export async function localFeed(req: Request, res: Response) {
  try {
    const { limit, skip } = parsePagination(req);

    // Local feed: posts with visibility public or unlisted and actor belonging to local domain
    const posts = await Post.find({
      visibility: { $in: ['public', 'unlisted'] },
      actor: { $not: /https?:\/\// },
    })
      .sort({ published: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ ok: true, data: posts });
  } catch {
    return res.status(500).json({ ok: false, error: 'Failed to load local feed' });
  }
}
