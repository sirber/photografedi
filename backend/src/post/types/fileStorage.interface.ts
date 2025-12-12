import type fs from 'fs';

export type MulterFileWithPath = Express.Multer.File & { path?: string; buffer?: Buffer };

export interface SavedFile {
  filename: string;
  originalName: string;
  mime: string;
  size?: number;
  path: string;
  url: string;
}

export interface FileStorage {
  ensureUploadsDir(): Promise<string>;
  saveFile(file: MulterFileWithPath): Promise<SavedFile>;
  getFilePath(filename: string): string;
  getFileStream(filename: string): fs.ReadStream | NodeJS.ReadableStream;
  fileExists(filename: string): Promise<boolean>;
}
