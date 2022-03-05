require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect data during user creation'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('A user with this email already exists'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'SecretNotProduction',
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: 'None',
          maxAge: 600000 * 24 * 7,
          secure: true,
        })
        .status(200)
        .send({ message: 'Logged in' })
        .end();
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => { throw new NotFoundError('User was not found with the specified _id'); })
    .then((user) => res.send({ user }))
    .catch(() => {
      const message = 'User not found';
      return next(new BadRequestError(message));
    });
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(userId, { name, email }, { new: true })
    .orFail(() => { throw new NotFoundError('User was not found with the specified _id'); })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect data during user update'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('A user with this email already exists'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
