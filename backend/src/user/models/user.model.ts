import  { model, Schema } from 'mongoose';
import type { UserInterface } from '../types/user.interface';

const UserSchema: Schema = new Schema<UserInterface>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, default: 'Person' },
    preferredUsername: { type: String },
    inbox: { type: String },
    outbox: { type: String },
    followers: { type: String },
    following: { type: String },
    publicKey: {
      id: { type: String },
      owner: { type: String },
      publicKeyPem: { type: String },
    },
    providers: {
      google: {
        id: { type: String },
        profile: { type: Schema.Types.Mixed }
      },
      microsoft: {
        id: { type: String },
        profile: { type: Schema.Types.Mixed }
      }
    },
    summary: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export const User = model<UserInterface>('User', UserSchema);
