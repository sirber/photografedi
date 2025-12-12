import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Serves uploaded files from UPLOAD_DIR (or public/uploads fallback) with path traversal protection
export default function downloadAttachment(req: Request, res: Response) {
  try {
    const { filename } = req.params as { filename?: string };
    if (!filename) return res.status(400).json({ ok: false, error: 'Missing filename' });

    // Prevent path traversal
    if (filename.includes('..') || path.isAbsolute(filename)) {
      return res.status(400).json({ ok: false, error: 'Invalid filename' });
    }

    const uploadsDir = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), 'public', 'uploads');

    const filePath = path.join(uploadsDir, filename);

    // Ensure resolved path is inside uploadsDir
    const resolved = path.resolve(filePath);
    if (
      !resolved.startsWith(path.resolve(uploadsDir) + path.sep) &&
      resolved !== path.resolve(uploadsDir)
    ) {
      return res.status(400).json({ ok: false, error: 'Invalid filename' });
    }

    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      return res.status(404).json({ ok: false, error: 'File not found' });
    }

    const stream = fs.createReadStream(resolved);
    stream.on('open', () => {
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(filename)}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      stream.pipe(res);
    });
    stream.on('error', (err) => {
      console.error('downloadAttachment error', err);
      res.status(500).json({ ok: false, error: 'Failed to read file' });
    });
  } catch (err) {
    console.error('downloadAttachment handler error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
