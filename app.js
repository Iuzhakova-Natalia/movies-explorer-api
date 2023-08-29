require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./utils/config');

const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');

const { PORT = 3000, DB_PORT = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(DB_PORT);

app.use(helmet());
app.use(express.json());
app.use(cors);

app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
