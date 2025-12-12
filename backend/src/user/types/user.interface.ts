import { Document } from 'mongoose';

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  providers?: {
    google?: { id?: string; profile?: unknown };
    microsoft?: { id?: string; profile?: unknown };
  };
  type?: string;
  preferredUsername?: string;
  inbox?: string;
  outbox?: string;
  followers?: string;
  following?: string;
  publicKey?: {
    id?: string;
    owner?: string;
    publicKeyPem?: string;
  };
  summary?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}