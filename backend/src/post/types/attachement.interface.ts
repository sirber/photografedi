import { Types, Document } from 'mongoose';

export interface AttachmentInterface extends Document {
  user: Types.ObjectId;
  filename: string;
  originalName?: string;
  mime?: string;
  size?: number;
  visibility?: 'private' | 'public';
  createdAt?: Date;
  updatedAt?: Date;
}
