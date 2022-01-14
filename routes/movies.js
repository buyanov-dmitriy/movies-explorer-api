const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  urlValidate,
  ruValidate,
  enValidate,
} = require('../validation/validation');

const {
  getAllSavedMovies,
  addNewMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllSavedMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidate),
    trailer: Joi.string().required().custom(urlValidate),
    thumbnail: Joi.string().required().custom(urlValidate),
    nameRU: Joi.string().required().custom(ruValidate),
    nameEN: Joi.string().required().custom(enValidate),
    movieId: Joi.string().hex().length(24).required(),
  }),
}), addNewMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
