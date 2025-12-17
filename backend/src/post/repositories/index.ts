import LocalFileRepository from './local.repository';
import S3FileRepository from './s3.repository';
import type { FileStorage } from '../types/fileStorage.interface';

const storage = (process.env.STORAGE || 'local').toLowerCase();

let repo: FileStorage;
switch (storage) {
  case 's3':
    repo = new S3FileRepository();
    break;

  case 'local':
  default:
    repo = new LocalFileRepository();
    break;
}

export default repo;
