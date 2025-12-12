import fs from 'fs';
import { PassThrough } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import type { FileStorage, MulterFileWithPath, SavedFile } from '../types/fileStorage.interface';

type PutBody = Buffer | Uint8Array | ArrayBuffer | NodeJS.ReadableStream;

class S3FileRepository implements FileStorage {
  private client: S3Client;
  private bucket: string;
  private baseUrl?: string;

  constructor() {
    const region = process.env.S3_REGION || 'us-east-1';
    this.bucket = process.env.S3_BUCKET || '';
    this.baseUrl = process.env.S3_BASE_URL;
    this.client = new S3Client({ region });
    if (!this.bucket) throw new Error('S3_BUCKET env required for S3 storage');
  }

  async ensureUploadsDir() {
    return this.bucket;
  }

  async saveFile(file: MulterFileWithPath): Promise<SavedFile> {
    const id = uuidv4();
    const ext = file.originalname ? `.${String(file.originalname.split('.').pop() || '')}` : '';
    const key = `${id}${ext}`;

    let body: PutBody;
    if (file.buffer) body = file.buffer;
    else if (file.path) body = await fs.promises.readFile(file.path);
    else throw new Error('Unsupported file storage');

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: file.mimetype,
    });
    await this.client.send(cmd);

    const url = this.baseUrl
      ? `${this.baseUrl.replace(/\/$/, '')}/${key}`
      : `s3://${this.bucket}/${key}`;

    return {
      filename: key,
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      path: key,
      url,
    };
  }

  getFilePath(filename: string) {
    return `s3://${this.bucket}/${filename}`;
  }

  getFileStream(filename: string) {
    const pass = new PassThrough();
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: filename });
    this.client
      .send(cmd)
      .then((res) => {
        const body = res.Body;
        if (!body) {
          pass.emit('error', new Error('Empty body from S3'));
          return;
        }

        const isReadable = typeof (body as { pipe?: unknown }).pipe === 'function';
        const isEmitter = typeof (body as { on?: unknown }).on === 'function';

        if (isReadable) {
          (body as NodeJS.ReadableStream).pipe(pass);
          return;
        }

        if (isEmitter) {
          const chunks: Buffer[] = [];
          (body as NodeJS.ReadableStream).on('data', (c: Buffer) => chunks.push(c));
          (body as NodeJS.ReadableStream).on('end', () => pass.end(Buffer.concat(chunks)));
          (body as NodeJS.ReadableStream).on('error', (e: Error) => pass.emit('error', e));
          return;
        }

        if (Buffer.isBuffer(body)) {
          pass.end(body);
          return;
        }

        if (body instanceof ArrayBuffer) {
          pass.end(Buffer.from(body));
          return;
        }

        if (ArrayBuffer.isView(body)) {
          const view = body as ArrayBufferView;
          const u8 = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
          pass.end(Buffer.from(u8));
          return;
        }

        if (Array.isArray(body)) {
          pass.end(Buffer.from(body as number[]));
          return;
        }

        pass.emit('error', new Error('Unsupported body type from S3'));
      })
      .catch((err: unknown) => {
        pass.emit('error', err instanceof Error ? err : new Error(String(err)));
      });

    return pass;
  }

  async fileExists(filename: string) {
    try {
      const cmd = new HeadObjectCommand({ Bucket: this.bucket, Key: filename });
      await this.client.send(cmd);
      return true;
    } catch (err: unknown) {
      const code = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
      if (code === 404) return false;
      return false;
    }
  }
}

const s3Repository = new S3FileRepository();
export default s3Repository;
export { S3FileRepository };
