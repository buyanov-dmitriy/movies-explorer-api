require('dotenv').config();

const { PORT = 3000, NODE_ENV, BD_NAME } = process.env;
const database = NODE_ENV === 'production' ? BD_NAME : 'mongodb://localhost:27017/moviesdb';

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const auth = require('./middlewares/auth');
const errorHandling = require('./middlewares/error-handling');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = require('./configurations/apilimit');

const app = express();
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.use(limiter);

mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: [
    'https://buyanov-diploma.nomoredomains.rocks/',
    'http://buyanov-diploma.nomoredomains.rocks/',
    'https://api.buyanov-diploma.nomoredomains.rocks',
    'http://api.buyanov-diploma.nomoredomains.rocks',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  credentials: true,
}));

app.use(require('./routes/authentication'));
app.use(require('./routes/registration'));

app.use(auth);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());
app.use(errorHandling);

app.listen(PORT);
