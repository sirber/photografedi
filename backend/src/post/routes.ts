import { Router } from 'express';
import { userFeed } from './controllers/userFeed.controller';
import { localFeed } from './controllers/localFeed.controller';
import { federatedFeed } from './controllers/federatedFeed.controller';

const router = Router();

router.get('/feed/user/:username', userFeed);
router.get('/feed/local', localFeed);
router.get('/feed/federated', federatedFeed);

export default router;
