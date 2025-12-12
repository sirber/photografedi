import mongoose, { Schema } from 'mongoose';
import type { AttachmentInterface } from '../types/attachement.interface';

const AttachmentSchema: Schema = new Schema<AttachmentInterface>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String },
    mime: { type: String },
    size: { type: Number },
    visibility: { type: String, enum: ['private', 'public'], default: 'public' },
  },
  { timestamps: true }
);

export const Attachment = mongoose.model<AttachmentInterface>('Attachment', AttachmentSchema);
