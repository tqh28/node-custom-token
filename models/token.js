const mongoose = require('mongoose');
const TOKEN_CONSTANT = require('../constants/token');


const tokenSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiredDate: {
      type: Date,
      default: Date.now() + TOKEN_CONSTANT.TOKEN_LIFETIMES,
    }
  }, {
    collection: 'token',
  }
);

const Token = mongoose.model('token', tokenSchema);

exports.Token = Token;