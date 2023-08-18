const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { deleteMovieValidator, movieValidate } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

module.exports = router;

router.use(auth);
router.get('/', getMovies);
router.post('/', movieValidate, createMovie);
router.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = router;
