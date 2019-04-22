const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
  const db = config.get('db');
  mongoose.connect(db, { 'useNewUrlParser': true })
    .then(() => winston.info(`Connected to ${db}...`))
    .catch(() => winston.error(`Cannot connect to ${db}`));
  mongoose.set('useFindAndModify', false);
}
