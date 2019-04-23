const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

const connect = () => {
  const db = config.get('db');
  mongoose.connect(db, {
    useNewUrlParser: true,
    server: {
      // sets how many times to try reconnecting
      reconnectTries: Number.MAX_VALUE,
      // sets the delay between every retry (milliseconds)
      reconnectInterval: 1000
    }
  })
  .then(() => winston.info(`Connected to ${db}...`))
  .catch(() => {
    winston.error(`Cannot connect to ${db}`);
    winston.info(`Retry to connect to ${db} after 10s`);
    setTimeout(connect, 10000);
  });
  
  mongoose.set('useFindAndModify', false);
};

module.exports = connect;
