import localRepo from './local.repository';
import s3Repo from './s3.repository';

const storage = (process.env.STORAGE || 'local').toLowerCase();

let repo: typeof localRepo | typeof s3Repo = localRepo;
if (storage === 's3') repo = s3Repo;

export default repo;
