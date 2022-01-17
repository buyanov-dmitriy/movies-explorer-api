const router = require('express').Router();

const NotFoundError = require('../errors/not-found-err');

router.use('/', (req, res, next) => {
  next(new NotFoundError('Этой страницы пока нет'));
});

module.exports = router;
