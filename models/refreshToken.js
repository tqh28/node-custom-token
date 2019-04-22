const mongoose = require('mongoose');
const TOKEN_CONSTANT = require('../constants/token');


const refreshTokenSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiredDate: {
      type: Date,
      default: Date.now() + TOKEN_CONSTANT.REFRESH_TOKEN_LIFETIMES,
    }
  }, {
    collection: 'refresh_token'
  }
);

const RefreshToken = mongoose.model('refresh_token', refreshTokenSchema);

module.exports.RefreshToken = RefreshToken;