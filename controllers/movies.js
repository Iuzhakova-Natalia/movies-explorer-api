const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { ERROR_MESSAGE } = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie
    .find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;
  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGE.WRONG_DATA_MOVIE));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.MOVIE_NOT_FOUND);
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(ERROR_MESSAGE.ACCESS_ERROR);
      }
      movie.deleteOne().then(() => {
        res.status(200).send({
          message: movie,
        });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError(ERROR_MESSAGE.WRONG_DATA_MOVIE_DELETE),
        );
      }

      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
