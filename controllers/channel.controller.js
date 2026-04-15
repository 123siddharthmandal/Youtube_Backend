const Channel = require('../models/Channel.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');

const redis = require('../utils/redisClient');
const createChannel = async (req,res) => {
    try{
        const { ownerId,channelname,about}=req.body;
        const newChannel = new Channel({
            ownerId,
            channelname,
            about
        });
        await newChannel.save();
        return res.status(201).json({message:"Channel created successfully",channel:newChannel});
    }catch(error){
        console.error("Error creating channel:",error);
        res.status(500).json({message:"Internal server error"});
    }
}


const getAccountDetails  = async(req,res) => {
    try{

        const {userId} = req.body;
        //logic 

        const cacheKey = `accountDetails:${userId}`;
        try{
            const cachedData = await redis.get(cacheKey);
            if (cachedData){
                const parsedData = JSON.parse(cachedData);
                return res.status(200).json({message:"Account details fetched from redis cache",data:parsedData});



            }
        }catch(error){
            console.error("Error fetching cached data:",error);
        }


        const userDetails =await User.findById(userId);
        const data =await User.aggregate([
            {$match:{
                _id:new mongoose.Types.ObjectId(userId)
            }},

            // stage2
            {
                $lookup:{
                    from:"channels",
                    localField:"_id",
                    foreignField:"ownerId",
                    as:"channelDetails"
                }


            },
            {
                // convert array to object
                $unwind:{
                    path:"$channelDetails",
                }
            },
            {
                $project:{
                    username:1,
                    about:1,
                    channelname:"$channelDetails.channelname",
                    about:"$channelDetails.about"
                }
            }


        ]);

        await redis.set(cacheKey,JSON.stringify(data,userDetails), "EX", 100);

        return res.status(200).json
        ({message:"Account details fetched successfully",data:data});

       
       


    }catch(error){
        console.log("Error fetching account details:",error);
    }

}


 const getAllDetails = async (req,res) => {
            try{

                const{userId} = req.params;
                
             const redisKey = `all_Details:${userId}`;
             try{
                const redisData = await redis.get(redisKey);
                if(redisData){
                    const parsedData = JSON.parse(redisData);
                    return res.status(200).json({message:"All details fetched from redis cache", all_Details:parsedData});
                }

             } catch(error){
                console.error("Error fetching data from redis:",error);
             }

                const data = await User.aggregate([

                    //staege 1
                    {
                        $match:{
                            _id:new mongoose.Types.ObjectId(userId)
                        
                        }
                    },
                    //stage 2 perform join between two fields  users and channels
                    {
                        $lookup:{
                            from:"channels",
                            localField:"_id",
                            foreignField:"ownerId",
                            as:"channel"
                        }
                    },

                    {

                        $lookup:{
                            from:"videos",
                            localField:"channel._id",
                            foreignField:"channelId",
                            as:"videos" 
                        }
                    },
                    {
                        $lookup:{
                            from:"videostats",
                            localField:"videos._id",
                            foreignField:"video_id",
                            as:"videoStats"
                        }
                    },

                    {
                        $addFields:{
                            //new field name your choice
                            videos:{
                                $map:{
                                    //iterate through videos array
                                    input:"$videos",
                                    // array having multiple videos {{v1}.{v2}}
                                    // stats :[{s1},{s2},{s3}]
                                    as:"video", //single video

                                    in:{ //inside in we can access each video as $$video
                                        $mergeObjects:[
                                            "$$video",
                                            {
                                                stats:{
                                                    $arrayElemAt:[
                                                        {
                                                            $filter:{
                                                                input:"$videoStats",
                                                                as:"stat",
                                                                cond:{$eq:["$$stat.video_id","$$video._id"]}
                                                            }
                                                        },
                                                        0
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            videoStats:0
                        }
                    }
                ]);
                await redis.set(redisKey,JSON.stringify(parsedData), "EX", 100);
                return res.status(200).json({message:"All details fetched successfully", all_Details:parsedData});
            }catch(error){
                console.error("Error fetching all details:",error);
                res.status(500).json({message:"Internal server error"});
            }
        }



        const getResultFromCbse = async(req,res) => {
            try{
                const{userId} = req.params;

                const key = 'key:${userId}';
                const limit = 5;
                const time_duartion = 60;
                const requests = await redis.incr(key);

                await redis.expire(key,time_duartion);
                if(requests > limit){
                    return res.status(429).json({message:"Too many requests. Please try again later."});
                }
                return res.status(200).json({message:"Request successful",data:{result:"Passed"}});

            }catch(err){
                console.error("Error fetching result from cbse:",err);
                res.status(500).json({message:"Internal server error"});
            }
        }
  
module.exports = {createChannel,getAccountDetails,getAllDetails,getResultFromCbse};