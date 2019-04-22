const mongoose = require('mongoose');
const { Token } = require('../models/token');

module.exports = async (req, res, next) => {
  let token = req.header('auth-token');
  if (!token) {
    return res.status(401).send('Access denied. No token provided');
  } else {
    token = token.replace(/Bearer /g, '');
    tokenObject = await Token.findOne({token: token});
    if (!tokenObject) {
      return res.status(401).send('Access denied. Token is not valid');
    } else {
      req.accountId = tokenObject.accountId;
    }
  }

  next();
};