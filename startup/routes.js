const express = require('express');
const usersRoute = require('../routes/user');
const authRoute = require('../routes/auth');

module.exports = (app) => {
  app.use(express.json());
  app.use('/api/users', usersRoute);
  app.use('/api/auth', authRoute)
}