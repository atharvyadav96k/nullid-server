const express = require('express');
const api = express.Router();
const authRouter = require('./authRouter');
const backdoorRouter = require('./backdoorRouter');
const chatRouter = require('./chatRouter')

api.use('/auth', authRouter);
api.use('/backdoors', backdoorRouter);
api.use('/chats', chatRouter);

module.exports = api;