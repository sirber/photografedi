import { Document } from 'mongoose';

export type ActorRef = string;

export interface AttachmentInterface {
  type?: string;
  mediaType?: string;
  url?: string;
  name?: string;
  width?: number;
  height?: number;
  size?: number;
  duration?: number;
  blurhash?: string;
  meta?: unknown;
}

export interface PostInterface extends Document {
  id?: string; // ActivityPub id (URL)
  url?: string;
  type: string; // e.g., "Note"
  published?: Date;
  updated?: Date;
  attributedTo?: ActorRef;
  actor?: ActorRef;
  content?: string;
  summary?: string;
  to?: string[]; // audience
  cc?: string[];
  bto?: string[]; // blind to (optional)
  bcc?: string[];
  audience?: string[]; // convenience
  attachment?: AttachmentInterface[];
  inReplyTo?: string | null;
  replies?: string[]; // array of ActivityPub reply IDs or local refs
  likesCount?: number;
  sharesCount?: number;
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  origin?: string; // origin server or collection
  raw?: unknown; // store original activity as JSON
  createdAt?: Date;
  updatedAt?: Date;
}