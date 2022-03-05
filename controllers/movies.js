const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getAllSavedMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

const addNewMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  const userId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: userId,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect data adding a movie'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => { throw new NotFoundError('Movie with the specified _id not found'); })
    .then((movie) => {
      const { owner } = movie;
      if (String(owner) !== String(userId)) {
        return next(new ForbiddenError('No rights to delete a movie'));
      }
      return Movie.findByIdAndRemove(movieId)
        .orFail(() => { throw new NotFoundError('Movie with the specified _id not found'); })
        .then((deletedMovie) => res.send({ deletedMovie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Incorrect _id of the movie'));
      }
      return next(err);
    });
};

module.exports = {
  getAllSavedMovies,
  addNewMovie,
  deleteMovie,
};
