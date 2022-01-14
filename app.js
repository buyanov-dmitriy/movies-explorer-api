require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const errorHandling = require('./middlewares/error-handling');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err');

const limiter = require('./configurations/apilimit');

const {
  login,
  createUser,
} = require('./controllers/users');

const app = express();
app.use(helmet());
app.use(cookieParser());

app.use(limiter);

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.post('/signin', login, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}));
app.post('/signup', createUser, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}));

app.use(auth);

app.use('/', require('./routes/index'));

app.post('/signout', (req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
      maxAge: -1,
    })
    .status(200)
    .send({ message: 'Разлогирование успешно' })
    .end();
});

app.use('/', (req, res, next) => {
  next(new NotFoundError('Этой страницы пока нет'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandling);

app.listen(PORT);
