import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const attachmentVisibility = pgEnum('attachment_visibility', ['private', 'public']);

export const postVisibility = pgEnum('post_visibility', [
  'public',
  'unlisted',
  'private',
  'direct',
]);

// Users table (converted from Mongoose User model)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: text('password').notNull(),
  type: varchar('type', { length: 100 }).default('Person'),
  preferred_username: varchar('preferred_username', { length: 255 }),
  inbox: text('inbox'),
  outbox: text('outbox'),
  followers: text('followers'),
  following: text('following'),
  // store structured objects as JSONB
  public_key: jsonb('public_key'),
  providers: jsonb('providers'),
  summary: text('summary'),
  icon: text('icon'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Attachments table (converted from Mongoose Attachment model)
export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  filename: text('filename').notNull(),
  original_name: text('original_name'),
  mime: varchar('mime', { length: 255 }),
  size: integer('size'),
  visibility: attachmentVisibility('visibility').default('public'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Posts table (converted from Mongoose Post model)
// - flexible fields (arrays, embedded attachments, raw activity) are stored as JSONB
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  // ActivityPub id (URL) - corresponds to Mongoose `id` field
  ap_id: text('ap_id'),
  url: text('url'),
  type: varchar('type', { length: 100 }).default('Note'),
  published: timestamp('published'),
  updated: timestamp('updated'),
  attributed_to: text('attributed_to'),
  actor: text('actor'),
  content: text('content'),
  summary: text('summary'),
  // store lists and embedded objects as jsonb for flexibility
  to: jsonb('to').default('[]'),
  cc: jsonb('cc').default('[]'),
  bto: jsonb('bto').default('[]'),
  bcc: jsonb('bcc').default('[]'),
  audience: jsonb('audience').default('[]'),
  // embedded attachment objects (for federation)
  attachment: jsonb('attachment').default('[]'),
  // local attachment ids (references to attachments table by id or external ids)
  attachment_ids: jsonb('attachment_ids').default('[]'),
  in_reply_to: text('in_reply_to'),
  replies: jsonb('replies').default('[]'),
  likes_count: integer('likes_count').default(0),
  shares_count: integer('shares_count').default(0),
  visibility: postVisibility('visibility').default('public'),
  origin: text('origin'),
  raw: jsonb('raw'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Note: unique constraints and additional indexes (for example on `username`, `email`, and `ap_id`)
// can be added via Drizzle migration files or by using the `index` / `uniqueIndex` helpers
// depending on how you want to enforce them in Postgres. This file focuses on porting
// the shape of the data from the Mongoose models to Drizzle/PG types.
// TODO: migrate schema to PostgreSQL using Drizzle ORM
