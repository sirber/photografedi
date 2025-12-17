import { API_URL } from "@/constants";

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

export async function createPost(payload: CreatePostPayload) {
  const res = await fetch(`${API_URL}/post`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`post failed ${res.status}`);
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || "post failed");
  return j.data;
}

export default { createPost };
