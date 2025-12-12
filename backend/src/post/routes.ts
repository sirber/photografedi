import { Router } from 'express';
import { userFeed } from './controllers/userFeed.controller';
import { localFeed } from './controllers/localFeed.controller';
import { federatedFeed } from './controllers/federatedFeed.controller';
import createPost from './controllers/createPost.controller';
import requireAuth from '../auth/requireAuth';

const router = Router();

// Public feeds
router.get('/feed/user/:username', userFeed);
router.get('/feed/local', localFeed);
router.get('/feed/federated', federatedFeed);

// Authenticated routes
router.get('/feed/user', requireAuth, userFeed);
router.post('/', requireAuth, createPost);

export default router;
