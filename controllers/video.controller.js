const Video = require('../models/Video.model');
const VideoStats = require('../models/VideoStats');

//controller to insert video

const publishVideo = async(req,res) => {
    try{
        const{title,description,channelId,category,tags}=req.body;

        const video = new Video({
            title,description,channelId
        })
        await video.save();


        const stats = new VideoStats({
            
            category,
            tags,
            video_id:video._id
        });
        await stats.save();
        return res.status(201).json({message:"Video published successfully",video:video,stats:stats}); 

    }catch(error){
        console.error("Error publishing video:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

// export the controlller
module.exports={publishVideo};