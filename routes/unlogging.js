const router = require('express').Router();

router.post('/signout', (req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
      maxAge: -1,
    })
    .status(200)
    .send({ message: 'Разлогирование успешно' })
    .end();
});

module.exports = router;
