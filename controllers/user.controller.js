const User = require("../models/User.model");
const createUser= async (req,res)=>{
    try{
        const{username,email}=req.body;
        const newUser = new User({
            username,email
        });
        await newUser.save();
        res.status(201).json({message:"User created successfully", user:newUser});
    } catch(error){
        res.status(500).json({message:"Error creating user", error:error.message});
    }}
const getUsers = async(req,res) => {
    try{
        //pagination logic
//get page numeber and limit from query params
        const page = parseInt(req.query.page) || 1;
        // get the set limit of records per page
        const limit = parseInt(req.query.limit) || 2;
        // calculate the number of documents to skip or users to skip
        const skip = (page - 1) * limit;

        //pipeline for aggregation
        const data = await User.aggregate([

            //stage 1
            {
                $sort:{
                    createdAt:-1  // sort by createdAt in descending order recent first users
                }
            },
            //stage 2
            {
                $skip: skip
            },

            //stage 3
            {
                $limit: limit
            }
        ]);
        // return response
        return res.status(200).json({message:"Users fetched successfully", data:data});

    }catch(error){
        res.status(500).json({message:"Error fetching users", error:error.message});
    }
}
module.exports = { createUser , getUsers};