const express = require('express');
const api = express.Router();
const authRouter = require('./authRouter');
const backdoorRouter = require('./backdoorRouter')

api.use('/auth', authRouter);
api.use('/backdoors', backdoorRouter);

module.exports = api;