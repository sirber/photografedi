import { Router } from 'express';
import { userFeed } from './controllers/userFeed.controller';
import { localFeed } from './controllers/localFeed.controller';
import { federatedFeed } from './controllers/federatedFeed.controller';
import createPost from './controllers/createPost.controller';
import requireAuth from '../auth/requireAuth';
import createAttachment from './controllers/createAttachment.controller';
import multer from 'multer';
import downloadAttachment from './controllers/downloadAttachment.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// Public feeds
router.get('/feed/user/:username', userFeed);
router.get('/feed/local', localFeed);
router.get('/feed/federated', federatedFeed);
router.get('/media/:filename', requireAuth, downloadAttachment);

// Authenticated routes
router.get('/feed/user', requireAuth, userFeed);
router.post('/media', requireAuth, upload.single('file'), createAttachment);
router.post('/post', requireAuth, createPost);

export default router;
