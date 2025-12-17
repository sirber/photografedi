export type CreatePostPayload = {
  content?: string;
  visibility?: "public" | "unlisted" | "private" | "direct";
  published?: string;
  attachment?: Array<{
    id: string;
    url: string;
    mediaType?: string;
    name?: string;
    size?: number;
  }>;
};
