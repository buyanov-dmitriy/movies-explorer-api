const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('/', require('./unlogging'));
router.use('/', require('./not-found-page'));

module.exports = router;
