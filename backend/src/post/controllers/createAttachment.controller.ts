import type { Response } from 'express';
import type { AuthRequest } from '../../auth/types';
import { User } from '../../user/models/user.model';
import type { UserInterface } from '../../user/types/user.interface';
import { Attachment } from '../models/attachment.model';
import repo from '../repositories';
import type { MulterFileWithPath } from '../types/fileStorage.interface';

type UserLike = Partial<UserInterface> & { _id?: string; id?: string; username?: string };

export async function createAttachment(req: AuthRequest, res: Response) {
  try {
    // Expect multer to have placed the file on req.file
    const file = (req as unknown as { file?: MulterFileWithPath }).file;
    if (!file) return res.status(400).json({ ok: false, error: 'No file uploaded' });

    const saved = await repo.saveFile(file as MulterFileWithPath);
    const fileName = saved.filename;
    const url = saved.url;

    // Resolve user id from request. `AuthRequest.user` is a Partial<UserInterface>.
    let userId: string | undefined = undefined;
    const user = req.user as UserLike | undefined;
    if (user && user._id) userId = String(user._id);
    else if (user && user.id) userId = String(user.id);
    else if (user && user.username) {
      const u = (await User.findOne({ username: user.username }).select('_id').lean()) as {
        _id?: string;
      } | null;
      if (u && u._id) userId = String(u._id);
    }
    if (!userId) return res.status(401).json({ ok: false, error: 'Not authenticated' });

    // Create Attachment document
    const doc = await Attachment.create({
      user: userId,
      filename: fileName,
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      visibility: 'public',
    });

    const attachment = {
      id: doc._id,
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
