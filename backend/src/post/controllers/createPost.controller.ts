import type { Response } from 'express';
import mongoose from 'mongoose';
import Post from '../models/post.model';
import type { PostInterface, AttachmentInterface } from '../types/post.interface';
import type { AuthRequest } from '../../auth/types';

function parsePayload(payload: unknown, actorUsername?: string): Partial<PostInterface> {
  const p: Record<string, unknown> = (payload as Record<string, unknown>) || {};
  const doc: Partial<PostInterface> = {};

  if (typeof p.id === 'string') doc.id = p.id;
  if (typeof p.url === 'string') doc.url = p.url;
  if (typeof p.type === 'string') doc.type = p.type;
  if (
    typeof p.published === 'string' ||
    typeof p.published === 'number' ||
    p.published instanceof Date
  ) {
    doc.published = new Date(p.published);
  }
  if (typeof p.updated === 'string' || typeof p.updated === 'number' || p.updated instanceof Date) {
    doc.updated = new Date(p.updated);
  }
  if (typeof p.attributedTo === 'string') doc.attributedTo = p.attributedTo;
  if (typeof p.actor === 'string') doc.actor = p.actor;
  if (typeof p.content === 'string') doc.content = p.content;
  if (typeof p.summary === 'string') doc.summary = p.summary;
  if (Array.isArray(p.to)) doc.to = p.to.map(String);
  if (Array.isArray(p.cc)) doc.cc = p.cc.map(String);
  if (Array.isArray(p.bto)) doc.bto = p.bto.map(String);
  if (Array.isArray(p.bcc)) doc.bcc = p.bcc.map(String);
  if (Array.isArray(p.audience)) doc.audience = p.audience.map(String);
  if (Array.isArray(p.attachment)) {
    doc.attachment = p.attachment.map((a: unknown) => {
      const at = a as AttachmentInterface;
      return {
        type: typeof at.type === 'string' ? at.type : undefined,
        mediaType: typeof at.mediaType === 'string' ? at.mediaType : undefined,
        url: typeof at.url === 'string' ? at.url : undefined,
        name: typeof at.name === 'string' ? at.name : undefined,
        width: typeof at.width === 'number' ? at.width : undefined,
        height: typeof at.height === 'number' ? at.height : undefined,
        size: typeof at.size === 'number' ? at.size : undefined,
        duration: typeof at.duration === 'number' ? at.duration : undefined,
        blurhash: typeof at.blurhash === 'string' ? at.blurhash : undefined,
        meta: at.meta,
      } as AttachmentInterface;
    });
  }
  if (Array.isArray(p.attachmentIds)) {
    doc.attachmentIds = p.attachmentIds.map(String);
  }
  if (typeof p.inReplyTo === 'string') doc.inReplyTo = p.inReplyTo;
  if (Array.isArray(p.replies)) doc.replies = p.replies.map(String);
  if (typeof p.likesCount === 'number') doc.likesCount = p.likesCount;
  if (typeof p.sharesCount === 'number') doc.sharesCount = p.sharesCount;
  if (
    p.visibility === 'public' ||
    p.visibility === 'unlisted' ||
    p.visibility === 'private' ||
    p.visibility === 'direct'
  )
    doc.visibility = p.visibility;
  if (typeof p.origin === 'string') doc.origin = p.origin;
  if (p.raw !== undefined) doc.raw = p.raw as unknown;

  // Prefer actorUsername param when provided
  if (!doc.actor && typeof actorUsername === 'string') doc.actor = actorUsername;

  return doc;
}

// Create a new post from an ActivityPub-like object
export async function createPost(req: AuthRequest, res: Response) {
  try {
    const payload = req.body || {};
    const actorUsername = req.user?.username;
    const doc = parsePayload(payload, actorUsername);

    // Ensure published timestamp
    if (!doc.published) doc.published = new Date();

    // Ensure id (unique). Use a new ObjectId string when not provided.
    if (!doc.id) doc.id = new mongoose.Types.ObjectId().toString();

    // Check uniqueness of id
    if (doc.id) {
      const exists = await Post.findOne({ id: doc.id }).lean();
      if (exists)
        return res.status(409).json({ ok: false, error: 'Post with this id already exists' });
    }

    const created = await Post.create(doc as Partial<PostInterface>);
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error('createPost error', err);
    return res.status(500).json({ ok: false, error: 'Failed to create post' });
  }
}

export default createPost;
