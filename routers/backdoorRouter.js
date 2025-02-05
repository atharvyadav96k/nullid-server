const express = require('express');
const bdRouter = express.Router();
const { isAuth } = require('../database/loginSchema')
const { getSuperUserBackDoors, createBackDoor, updateBackDoor, terminateBackDoor } = require('../database/backDoorDb');

// Serve the name of backdoors created by admin
bdRouter.post('/getAllBackdoors', isAuth, async (req, res) => {
    try {
        const { auth } = req.body;
        if (!auth) {
            return res.status(400).json({
                message: "Failed to get backdoor's",
                success: false,
                error: "Unauth user"
            });
        }
        const result = await getSuperUserBackDoors(auth.email);
        console.log(result);
        return res.status(200).json({
            message: "Successfully served backdoor's",
            success: true,
            data: result.Items
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Failed to terminate backdoor",
            success: false,
            error: err.message
        });
    }
});
// create new backdoor
bdRouter.post('/newBackDoor', isAuth, async (req, res) => {
    try {
        const { name, super_user_visibility, backdoor_talk, auth } = req.body;
        console.log(name, super_user_visibility, backdoor_talk);
        if (!auth || !name || super_user_visibility === undefined || backdoor_talk === undefined) {
            return res.status(400).json({
                message: "Failed create new backdoor",
                success: false,
                error: "All fields are required"
            });
        }
        const result = await createBackDoor(name, auth.email, super_user_visibility, backdoor_talk);
        console.log(result);
    
        return res.status(200).json({
            message: "backdoor Successfully created",
            success: true,
            data: result
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Failed to create backdoor",
            success: false,
            error: err.message
        });
    }
});
// update settings like super user visibility and backdoor talks 
bdRouter.post('/updateBackdoorSettings', isAuth, async (req, res) => {
    try {
        const { name, super_user_visibility, backdoor_talk , auth} = req.body;
        if (!auth) {
            return res.status(400).json({
                message: "Failed update new backdoor",
                success: false,
                error: "Unauth user"
            });
        }
        const result = await updateBackDoor(name, auth.email, super_user_visibility, backdoor_talk);
        console.log(result);
    
        return res.status(200).json({
            message: "backdoor Successfully updated",
            success: true,
            data: result
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Failed to update backdoor settings",
            success: false,
            error: err.message
        });
    }
});
// delete backdoor 
bdRouter.post('/terminateBackdoor',isAuth, async (req, res)=>{
    try {
        const { name , auth} = req.body;
        if (!auth) {
            return res.status(400).json({
                message: "Failed terminate new backdoor",
                success: false,
                error: "Unauth user"
            });
        }
        const result = await terminateBackDoor(name, auth.email);
        console.log(result);
    
        return res.status(200).json({
            message: "backdoor Successfully terminated",
            success: true,
            data: result
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Failed to terminate backdoor settings",
            success: false,
            error: err.message
        });
    }
})
module.exports = bdRouter;