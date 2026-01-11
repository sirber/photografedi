import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
  uniqueIndex,
  type AnyPgColumn,
  index,
} from 'drizzle-orm/pg-core';

// Enums
export const attachmentVisibility = pgEnum('attachment_visibility', ['private', 'public']);

export const postVisibility = pgEnum('post_visibility', [
  'public',
  'unlisted',
  'private',
  'direct',
]);

// Tables
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    type: varchar('type', { length: 100 }).default('Person'),
    preferred_username: varchar('preferred_username', { length: 255 }),
    inbox: text('inbox'),
    outbox: text('outbox'),
    followers: text('followers'),
    following: text('following'),
    public_key: jsonb('public_key'),
    providers: jsonb('providers'),
    summary: text('summary'),
    icon: text('icon'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => [uniqueIndex('email_idx').on(table.email)]
);

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey(),
  user_id: uuid('user_id')
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

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey(),
    parent_id: uuid('parent_id').references((): AnyPgColumn => posts.id),
    thread_id: uuid('thread_id'),
    url: text('url'),
    type: varchar('type', { length: 100 }).default('Note'),
    published: timestamp('published'),
    updated: timestamp('updated'),
    attributed_to: text('attributed_to'),
    actor: text('actor'),
    content: text('content'),
    summary: text('summary'),
    to: jsonb('to').default('[]'),
    cc: jsonb('cc').default('[]'),
    bto: jsonb('bto').default('[]'),
    bcc: jsonb('bcc').default('[]'),
    audience: jsonb('audience').default('[]'),
    in_reply_to: text('in_reply_to'),
    likes_count: integer('likes_count').default(0),
    shares_count: integer('shares_count').default(0),
    visibility: postVisibility('visibility').default('public'),
    origin: text('origin'),
    raw: jsonb('raw'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('thread_id_idx').on(table.thread_id),
    index('posts_published_brin_idx').on(table.published),
  ]
);

export const postAttachments = pgTable(
  'post_attachments',
  {
    id: uuid('id').primaryKey(),
    post_id: uuid('post_id')
      .references(() => posts.id)
      .notNull(),
    attachment_id: uuid('attachment_id')
      .references(() => attachments.id)
      .notNull(),
    position: integer('position'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('post_attachment_post_attachment_unique').on(table.post_id, table.attachment_id),
  ]
);
