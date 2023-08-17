const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});

const DB_PORT = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  limiter,
  DB_PORT,
};
