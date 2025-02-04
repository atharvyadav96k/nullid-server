require('dotenv').config();
const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
const { createBackDoor } = require('./database/backDoorDb');
const { isAuth } = require('./database/loginSchema');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use("/api/v1", apiRouter);

const PORT = process.env.PORT;
app.get('/', isAuth, (req, res) => {
    const { auth } = req.body;
    res.send(auth);
})
app.post('/', isAuth, async (req, res) => {
    try {
        const { backdoor_name, super_user_visibility, backdoor_talk } = req.body;
        const { auth } = req.body;
        if(!auth && !backdoor_name && !super_user_visibility && !backdoor_talk){
            return res.status(300).json({
                message: "Failed to create backdoor",
                success: false,
                error: "All filed are required"
            });
        }
        const result = await createBackDoor(backdoor_name, auth.email, super_user_visibility, backdoor_talk);
        console.log(result);
        return res.status(300).json({
            message: "Backdoor created successfully",
            success: true,
            data: result
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Failed to create backdoor",
            success: false,
            error: err.message
        })
    }

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});