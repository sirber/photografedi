import { API_URL } from '@/constants';
import type { CreatePostPayload } from '@/types/Post';

export async function createPost(payload: CreatePostPayload) {
  const res = await fetch(`${API_URL}/post`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`post failed ${res.status}`);
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || 'post failed');
  return j.data;
}

export default { createPost };
