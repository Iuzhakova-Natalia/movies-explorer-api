const { celebrate, Joi } = require('celebrate');

const emailCheckPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
const urlCheckPattern = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;

const registerValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email().pattern(emailCheckPattern),
    password: Joi.string().required(),
  }),
});

const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().pattern(emailCheckPattern),
    password: Joi.string().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email().pattern(emailCheckPattern),
  }),
});

const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameEN: Joi.string().required(),
    nameRU: Joi.string().required(),
    image: Joi.string().required().pattern(urlCheckPattern),
    trailerLink: Joi.string().required().pattern(urlCheckPattern),
    thumbnail: Joi.string().required().pattern(urlCheckPattern),
    movieId: Joi.number().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  registerValidate,
  loginValidate,
  validateUpdateUser,
  movieValidate,
  deleteMovieValidator,
};
