import type { Request, Response } from 'express';
import path from 'path';
import repo from '../repositories';

// Serves uploaded files from configured repository (local filesystem for now)
export default async function downloadAttachment(req: Request, res: Response) {
  try {
    const { filename } = req.params as { filename?: string };
    if (!filename) return res.status(400).json({ ok: false, error: 'Missing filename' });

    // Prevent path traversal
    if (filename.includes('..') || path.isAbsolute(filename)) {
      return res.status(400).json({ ok: false, error: 'Invalid filename' });
    }

    const exists = await repo.fileExists(filename);
    if (!exists) return res.status(404).json({ ok: false, error: 'File not found' });

    const stream = repo.getFileStream(filename);
    stream.on('open', () => {
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(filename)}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      stream.pipe(res);
    });
    stream.on('error', (err: Error) => {
      console.error('downloadAttachment error', err);
      res.status(500).json({ ok: false, error: 'Failed to read file' });
    });
  } catch (err) {
    console.error('downloadAttachment handler error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
