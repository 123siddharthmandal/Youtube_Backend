const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
    },
    email:{
        type: String,
    },
    role:{
        type:String,
        default:"user"
    }
},{ timestamps: true });



const User =mongoose.model('User', userSchema);
module.exports = User;