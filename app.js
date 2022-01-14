require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

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

/*const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});*/

app.use(limiter);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*app.use(cors({
  origin: [
    'http://buyanov-dmitriy.students.nomoredomains.work',
    'https://buyanov-dmitriy.students.nomoredomains.work',
    'http://api.buyanov.students.nomoredomains.work',
    'https://api.buyanov.students.nomoredomains.work',
    'http://localhost:3000',
  ],
  credentials: true,
}));*/

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

/*app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));*/

app.post('/signout', (req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
      //sameSite: 'None',
      //maxAge: -1,
      //secure: true,
    })
    .end();
});

app.use('/', (req, res, next) => {
  next(new NotFoundError('Этой страницы пока нет'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandling);

app.listen(PORT);
