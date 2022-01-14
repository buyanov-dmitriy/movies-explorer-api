const validator = require('validator');

const urlValidate = (value, next) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  return next(new Error('Ошибка в валидации ссылки'));
};

const ruValidate = (value, next) => {
  const ruRegex = /[?!,.а-яА-ЯёЁ0-9\s]+$/;
  if (ruRegex.test(value)) {
    return value;
  }
  return next(new Error('Ошибка в валидации кириллицы'));
};

const enValidate = (value, next) => {
  const enRegex = /[?!,.a-zA-Z0-9\s]+$/;
  if (enRegex.test(value)) {
    return value;
  }
  return next(new Error('Ошибка в валидации латиницы'));
};

module.exports = {
  urlValidate,
  ruValidate,
  enValidate,
};
