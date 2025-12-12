import mongoose, { Schema } from 'mongoose';

export interface AttachmentDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  filename: string;
  originalName?: string;
  mime?: string;
  size?: number;
  visibility?: 'private' | 'public';
  createdAt?: Date;
  updatedAt?: Date;
}

const AttachmentSchema: Schema = new Schema<AttachmentDocument>(
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

export const Attachment = mongoose.model<AttachmentDocument>('Attachment', AttachmentSchema);

export default Attachment;
