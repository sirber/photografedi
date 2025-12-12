import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { FileStorage, MulterFileWithPath, SavedFile } from '../types/fileStorage.interface';

class LocalFileRepository implements FileStorage {
  private getUploadsDir() {
    return process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), 'public', 'uploads');
  }

  async ensureUploadsDir() {
    const dir = this.getUploadsDir();
    await fs.promises.mkdir(dir, { recursive: true });
    return dir;
  }

  async saveFile(file: MulterFileWithPath): Promise<SavedFile> {
    const uploadsDir = await this.ensureUploadsDir();
    const id = uuidv4();
    const ext = path.extname(file.originalname) || '';
    const fileName = `${id}${ext}`;
    const destPath = path.join(uploadsDir, fileName);

    if (file.buffer) {
      await fs.promises.writeFile(destPath, file.buffer);
    } else if (file.path) {
      await fs.promises.rename(file.path, destPath);
    } else {
      throw new Error('Unsupported file storage');
    }

    return {
      filename: fileName,
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      path: destPath,
      url: `${(process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')}/uploads/${fileName}`,
    };
  }

  getFilePath(filename: string) {
    const uploadsDir = this.getUploadsDir();
    return path.join(uploadsDir, filename);
  }

  getFileStream(filename: string) {
    const filePath = this.getFilePath(filename);
    return fs.createReadStream(filePath);
  }

  async fileExists(filename: string) {
    const filePath = this.getFilePath(filename);
    try {
      const st = await fs.promises.stat(filePath);
      return st.isFile();
    } catch {
      return false;
    }
  }
}

const localRepository = new LocalFileRepository();
export default localRepository;

export { LocalFileRepository };
