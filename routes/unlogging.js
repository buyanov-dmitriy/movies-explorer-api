const router = require('express').Router();

router.post('/signout', (req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
      sameSite: 'None',
      maxAge: -1,
      secure: true,
    })
    .status(200)
    .send({ message: 'Logged Out' })
    .end();
});

module.exports = router;
