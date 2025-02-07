const express = require('express');
const cRouter = express.Router();
const {saveChats} = require('../database/chatsDB');

cRouter.post('/saveChats', async (req, res)=>{
    try{
        const {message, backdoor} =  req.body;
        const result = await saveChats(message, backdoor);
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "failed to save chat",
            success: false,
            error : err.message
        });
    }
});

module.exports = cRouter;