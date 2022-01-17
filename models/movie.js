const mongoose = require('mongoose');

const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validation: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректная ссылка',
    },
  },
  trailer: {
    type: String,
    required: true,
    validation: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validation: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema.path('nameRU').validate((val) => {
  const ruRegex = /[?!,.а-яА-ЯёЁ0-9\s]+$/;
  return ruRegex.test(val);
}, 'Это не кириллица');
movieSchema.path('nameEN').validate((val) => {
  const enRegex = /[?!,.a-zA-Z0-9\s]+$/;
  return enRegex.test(val);
}, 'Это не латиница');

module.exports = mongoose.model('movie', movieSchema);
