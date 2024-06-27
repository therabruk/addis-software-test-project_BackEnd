const express = require('express');
const { createSong, getAllSongs, updateSong, deleteSong, getStats } = require('../controllers/songController');
const router = express.Router();

router.post('/songs', createSong);
router.get('/songs', getAllSongs);
router.put('/songs/:id', updateSong);
router.delete('/songs/:id', deleteSong);
router.get('/stats', getStats);

module.exports = router;
