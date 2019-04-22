const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  }, {
    collection: 'account',
  }
);

const Account = mongoose.model('account', accountSchema);

module.exports.Account = Account;