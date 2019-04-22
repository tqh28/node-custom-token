const express = require('express');
const winton = require('winston');
const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/routes')(app);


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winton.info("Server started at port: 3000");
});

module.exports = server;