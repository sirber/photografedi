import mongoose, { Schema } from 'mongoose';
import type { AttachmentInterface, PostInterface } from '../types/post.interface';

export type ActorRef = string;

const AttachmentSchema = new Schema<AttachmentInterface>({
  type: { type: String },
  mediaType: { type: String },
  url: { type: String },
  name: { type: String },
  width: { type: Number },
  height: { type: Number },
  size: { type: Number },
  duration: { type: Number },
  blurhash: { type: String },
  meta: { type: Schema.Types.Mixed },
});

const PostSchema: Schema = new Schema<PostInterface>(
  {
    id: { type: String, unique: true, sparse: true },
    url: { type: String },
    type: { type: String, default: 'Note' },
    published: { type: Date },
    updated: { type: Date },
    attributedTo: { type: String },
    actor: { type: String },
    content: { type: String },
    summary: { type: String },
    to: { type: [String], default: [] },
    cc: { type: [String], default: [] },
    bto: { type: [String], default: [] },
    bcc: { type: [String], default: [] },
    audience: { type: [String], default: [] },
    // embedded attachment objects (used for federation / ActivityPub)
    attachment: { type: [AttachmentSchema], default: [] },
    // local attachments referenced by id (Attachment documents)
    attachmentIds: { type: [String], default: [] },
    inReplyTo: { type: String, default: null },
    replies: { type: [String], default: [] },
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private', 'direct'],
      default: 'public',
    },
    origin: { type: String },
    raw: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes to allow lookup by ActivityPub id and by published date
PostSchema.index({ id: 1 });
PostSchema.index({ published: -1 });

export const Post = mongoose.model<PostInterface>('Post', PostSchema);

export default Post;
