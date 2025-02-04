const express = require('express');
const api = express.Router();
const authRouter = require('./authRouter');

api.use('/auth', authRouter);

module.exports = api;