const express = require('express');
const router = express.Router();
const { Account } = require('../models/account');
const { Token } = require('../models/token');
const { RefreshToken } = require('../models/refreshToken');
const bcrypt = require('bcrypt');
const randomToken = require('random-token');
const TOKEN_CONSTANT = require('../constants/token');


router.post('/register', async (req, res) => {
  const saltRounds = 10;
  const account = new Account({
    account: req.body.account,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  });

  await account.save();

  res.send('Account is created');
});

router.post('/login', async (req, res) => {
  const accountInfo = await Account.findOne({
    account: req.body.account,
    active: true,
  });

  if (! accountInfo) {
    res.status(400).send('Account is not found');
  } else if (bcrypt.compareSync(req.body.password, accountInfo.password)) {
    let token = null;
    let refreshToken = null;
    let accountToken = await Token.findOne({
      accountId: accountInfo._id,
    });
    let accountRefreshToken = await RefreshToken.findOne({
      accountId: accountInfo._id,
    });

    if (!accountToken) {
      // create token
      token = randomToken(TOKEN_CONSTANT.TOKEN_SIZE);
      accountToken = new Token({
        accountId: accountInfo._id,
        token: token
      });
      await accountToken.save();
    } else if (accountToken.expiredDate < Date.now()) {
      token = randomToken(TOKEN_CONSTANT.TOKEN_SIZE);
      await Token.where({_id: accountToken._id}).updateOne({$set: { token: token, expiredDate: Date.now() + TOKEN_CONSTANT.TOKEN_LIFETIMES }}).exec();
    } else {
      token = accountToken.token;
    }

    if (! accountRefreshToken) {
      // create refresh token
      refreshToken = randomToken(TOKEN_CONSTANT.REFRESH_TOKEN_SIZE);
      const accountRefreshToken = new RefreshToken({
        accountId: accountInfo._id,
        refreshToken: refreshToken,
      });
      await accountRefreshToken.save();
    } else if (accountRefreshToken.expiredDate < Date.now()) {
      refreshToken = randomToken(TOKEN_CONSTANT.REFRESH_TOKEN_SIZE);
      await RefreshToken.where({_id: accountRefreshToken._id}).updateOne({$set: { token: refreshToken, expiredDate: Date.now() + TOKEN_CONSTANT.REFRESH_TOKEN_LIFETIMES }}).exec();
    } else {
      refreshToken = accountRefreshToken.refreshToken;
    }

    const responseBody = {
      token: token,
      refreshToken: refreshToken,
    }
    res.send(responseBody);
  } else {
    res.status(400).send('Password is not correct');
  }

});

router.post('/renew-token', async (req, res) => {
  const oldRefreshToken = req.body.refreshToken;
  const refreshTokenObject = await RefreshToken.findOne({refreshToken: oldRefreshToken});
  if (refreshTokenObject && refreshTokenObject.expiredDate > Date.now()) {
    const newRefreshToken = randomToken(TOKEN_CONSTANT.REFRESH_TOKEN_SIZE);
    const newToken = randomToken(TOKEN_CONSTANT.TOKEN_SIZE);

    await RefreshToken.where({accountId: refreshTokenObject.accountId})
        .updateOne({refreshToken: newRefreshToken, expiredDate: Date.now() + TOKEN_CONSTANT.REFRESH_TOKEN_LIFETIMES});
    await Token.where({accountId: refreshTokenObject.accountId})
        .updateOne({token: newToken, expiredDate: Date.now() + TOKEN_CONSTANT.TOKEN_LIFETIMES});
    
    const responseBody = {
      token: newToken,
      refreshToken: newRefreshToken,
    }
    res.send(responseBody);
  } else {
    res.status(403).send('Invalid refresh token');
  }
});

module.exports = router;