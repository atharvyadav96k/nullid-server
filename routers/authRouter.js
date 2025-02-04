const express = require('express');
const aRouter = express.Router();
const {signUp, signIn, isAuth} = require('../database/loginSchema');
const {address} = require('../utils/userLocation');

aRouter.post('/sign-up', async (req, res) => {
    const { email, password } = req.body;
    try {
        let ip = req.ip;
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(',')[0]; // Get the first IP in the list
        }
        const loc = await address(ip);
        const result = await signUp(email, password, loc);
        res.send(result);
    } catch (err) {
        console.log(err)
        res.send("failed");
    }
})

aRouter.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await signIn(email, password);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = aRouter;