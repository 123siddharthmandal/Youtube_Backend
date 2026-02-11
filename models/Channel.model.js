const mongoose = require('mongoose');


// channelschema 
const channelSchema = new mongoose.Schema({

    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    channelname : {
        type: String,
    },
    about:{
        type: String,
    },
},{ timestamps: true });

// channelmodel

const Channel =mongoose.model('Channel', channelSchema);
module.exports = Channel;