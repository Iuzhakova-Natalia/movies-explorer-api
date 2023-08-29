const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { ERROR_MESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

/* GET /users/me - get current user data by Id */
const getUserById = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => next(new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND)))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, password, email,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User
      .create({
        name,
        password: hash,
        email,
      }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          ERROR_MESSAGE.WRONG_DATA_PROFILE,
        ));
      } else if (err.code === 11000) {
        next(new ConflictError(
          ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        ));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User
    .findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    )
    .orFail(() => next(new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_MESSAGE.WRONG_DATA_PROFILE));
      } else if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGE.EMAIL_ALREADY_EXISTS));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },

        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        {
          expiresIn: '7d',
        },
      );
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ jwt: token });
    })
    .catch(next);
};

const signout = (_, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  login,
  signout,
};
