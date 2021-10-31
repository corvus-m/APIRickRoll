
import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/characters', controller.getCharacters);
router.get('/character/:id', controller.getID);
router.put('/switchstatus/:id', controller.updateStatus);
router.delete('/character/:id', controller.deleteChar);
router.get('/status', controller.serverReady);

export = router;