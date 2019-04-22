const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const { Token } = require('../models/token');

router.get('/me', authMiddleware, async (req, res) => {
  res.send(`me page of ${req.accountId}`);
});

module.exports = router;