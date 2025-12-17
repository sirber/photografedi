import { API_URL } from "@/constants";

export type AttachmentResult = {
  id: string;
  url: string;
  mediaType?: string;
  name?: string;
  size?: number;
};

export async function uploadAttachment(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_URL}/post/attachment`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`upload failed ${res.status}`);
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || "upload failed");
  return j.data as AttachmentResult;
}

export default { uploadAttachment };
