const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const { ERROR_MESSAGE } = require('../utils/constants');
const { createUser, login, signout } = require('../controllers/users');
const { registerValidate, loginValidate } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

router.post('/signup', registerValidate, createUser);
router.post('/signin', loginValidate, login);
router.get('/signout', signout);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => next(new NotFoundError(`${ERROR_MESSAGE.URL_NOT_FOUND} ${req.originalUrl} `)));

module.exports = router;
