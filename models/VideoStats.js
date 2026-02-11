const mongoose = require('mongoose');

const VideoStatsSchema = new mongoose.Schema({

    video_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Video' 
    }, 
    views : {
        type: Number,
        default:0
    },
    likes:{
        type: Number,
        default:0
    },
    dislikes:{
        type: Number,
        default:0
    },
    tags:{
        type:[String],
    },
    category:{
        type:String,    
    },
    duration:{
        type:String,
    },
},{ timestamps: true });



const VideoStats =mongoose.model('VideoStats', VideoStatsSchema);
module.exports = VideoStats;