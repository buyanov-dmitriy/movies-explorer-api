require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const jwtFromCookies = req.cookies.jwt;

  if (!jwtFromCookies) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(jwtFromCookies, NODE_ENV === 'production' ? JWT_SECRET : 'SecretNotProduction');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
