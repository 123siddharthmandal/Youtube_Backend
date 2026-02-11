const express = require('express');
const router = express.Router();
const {createChannel} = require('../controllers/channel.controller');
const {getAccountDetails,getAllDetails} = require('../controllers/channel.controller');


router.post('/create-channel', createChannel);


router.get('/get-account-details', getAccountDetails);


router.get('/get-all-details/:userId', getAllDetails);


module.exports=router;