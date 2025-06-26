const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Remove authentication middleware for development
// router.use(authMiddleware);

// Route to get all content types
router.get('/all', contentController.getAllContent);

// Route to get all movies
router.get('/movies', contentController.getMovies);

// Route to get all series
router.get('/series', contentController.getSeries);

// Route to get all anime
router.get('/anime', contentController.getAnime);

// Movies, series, anime by ID (ensures contentid is set)
router.get('/movie/:id', contentController.getMovieById);
router.get('/series/:id', contentController.getSeriesById);
router.get('/anime/:id', contentController.getAnimeById);

// Fetch by contentid (for continue watching/history)
router.get('/by-contentid/:contentid', contentController.getContentByContentId);

// User history
router.get('/history/:username', contentController.getUserHistory);
router.post('/history/:username/add', contentController.addToUserHistory);

// Fetch content from history base, and for series/anime, aggregate all episodes/seasons by name
router.get('/history-content/:username/:contentid', contentController.getHistoryContent);

// All episodes for a series by name
router.get('/series-episodes/:seriesName', contentController.getAllEpisodesBySeriesName);

// Add this POST route:
router.post('/history/:username/:contentid', contentController.addToUserHistory);

module.exports = router; 