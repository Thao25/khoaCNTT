const express = require('express');
const { createUser, handleLogin, getAllUser, getAccount, updateUserByAdmin } = require('../controllers/userController');
const authentication = require('../middleware/authentication');
const userRouter = express.Router();
const delay = require('../middleware/delay');
const {uploadProfileImage} = require('../middleware/uploads');


userRouter.all("*", authentication);

userRouter.post("/create",uploadProfileImage.single('profileImage'), createUser)
userRouter.post("/login", handleLogin)
userRouter.get("/getAllUser", getAllUser)
userRouter.get("/:id", delay, getAccount)
userRouter.put('/admin/:id',uploadProfileImage.single('profileImage'),updateUserByAdmin)

module.exports = userRouter ;

