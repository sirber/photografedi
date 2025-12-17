import { useState } from "react";
import postRepo from "@/repositories/postRepository";
import attachmentRepo from "@/repositories/attachmentRepository";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
  LinearProgress,
  Stack,
  Avatar,
} from "@mui/material";
import type { Attachment } from "@/types/Attachement";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleVisibility = (e: SelectChangeEvent) => {
    setVisibility(e.target.value as string);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return setFile(null);
    setFile(f);
  };

  async function uploadAttachment(): Promise<Attachment> {
    if (!file) throw new Error("No file selected");

    try {
      setUploading(true);
      return await attachmentRepo.uploadAttachment(file);
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let att: Attachment | null = attachment;
      if (file && !attachment) {
        att = await uploadAttachment();
        setAttachment(att);
      }

      const payload: Record<string, unknown> = {
        content,
        visibility,
        published: new Date().toISOString(),
      };
      if (att) payload.attachment = [att];

      await postRepo.createPost(payload);

      // Reset form on success
      setContent("");
      setFile(null);
      setAttachment(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create Post
        </Typography>

        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="visibility-label">Visibility</InputLabel>
          <Select
            labelId="visibility-label"
            value={visibility}
            label="Visibility"
            onChange={handleVisibility}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="unlisted">Unlisted</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="direct">Direct</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Button variant="outlined" component="label">
            Upload Attachment
            <input
              hidden
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">{file.name}</Typography>
              <Typography variant="caption">
                ({Math.round(file.size / 1024)} KB)
              </Typography>
            </Box>
          )}

          {attachment && (
            <Avatar
              alt={attachment.name}
              src={attachment.url}
              sx={{ width: 48, height: 48 }}
            />
          )}
        </Stack>

        {uploading && <LinearProgress sx={{ mt: 2 }} />}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            disabled={saving || uploading}
            variant="contained"
            type="submit"
          >
            {saving ? "Saving..." : "Create"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setContent("");
              setFile(null);
              setAttachment(null);
              setError(null);
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
