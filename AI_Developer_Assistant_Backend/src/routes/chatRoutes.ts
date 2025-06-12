import { Router } from 'express';
import * as chatController from '../controllers/chatController';

const router = Router();


router.post('/query', chatController.postQuery);
router.get('/getchatlog', chatController.getChats);

export default router;