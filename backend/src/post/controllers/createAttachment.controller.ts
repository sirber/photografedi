import type { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { AuthRequest } from '../../auth/types';

type MulterFileWithPath = Express.Multer.File & { path?: string; buffer?: Buffer };

export async function createAttachment(req: AuthRequest, res: Response) {
  try {
    // Expect multer to have placed the file on req.file
    const file = (req as unknown as { file?: MulterFileWithPath }).file;
    if (!file) return res.status(400).json({ ok: false, error: 'No file uploaded' });

    const uploadsDir = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    const id = uuidv4();
    const ext = path.extname(file.originalname) || '';
    const fileName = `${id}${ext}`;
    const destPath = path.join(uploadsDir, fileName);

    // If multer used memoryStorage, file.buffer exists
    if (file.buffer) {
      fs.writeFileSync(destPath, file.buffer);
    } else if (file.path) {
      // If multer stored on disk, move it
      fs.renameSync(file.path, destPath);
    } else {
      return res.status(500).json({ ok: false, error: 'Unsupported file storage' });
    }

    const base = process.env.FRONTEND_URL || `http://localhost:3000`;
    const url = `${base.replace(/\/$/, '')}/uploads/${fileName}`;

    const attachment = {
      url,
      mediaType: file.mimetype,
      name: file.originalname,
      size: file.size,
    };

    return res.status(201).json({ ok: true, data: attachment });
  } catch (err) {
    console.error('createAttachment error', err);
    return res.status(500).json({ ok: false, error: 'Failed to save attachment' });
  }
}

export default createAttachment;
