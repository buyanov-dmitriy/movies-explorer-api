module.exports = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  if (err.message === 'Validation failed') {
    statusCode = 400;
    message = 'Переданы некорректные данные';
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
