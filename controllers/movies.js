const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getAllSavedMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.status(200).send({ movies }))
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
    .then((movie) => res.status(200).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при добавлении фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => { throw new NotFoundError('Фильм с указанным _id не найден'); })
    .then((movie) => {
      const { owner } = movie;
      if (String(owner) !== String(userId)) {
        return next(new ForbiddenError('Нет прав для удаления фильма'));
      }
      return Movie.findByIdAndRemove(movieId)
        .orFail(() => { throw new NotFoundError('Фильм с указанным _id не найден'); })
        .then((deletedMovie) => res.status(200).send({ deletedMovie }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Передан некорректный _id фильма'));
          }
          return next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getAllSavedMovies,
  addNewMovie,
  deleteMovie,
};
