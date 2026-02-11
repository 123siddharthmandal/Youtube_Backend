const express = require('express');
const router = express.Router();
const {createUser,getUsers} = require('../controllers/user.controller');


//api to create user
router.post('/create-user', createUser);
router.get('/get-users', getUsers);
module.exports=router;