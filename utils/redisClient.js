const Redis = require("ioredis");

const redis = new Redis({
    host:"redis",
    port:6379
})

redis.on("connect",()=>{
    console.log("Redis db connected");
});

redis.on("error",(err)=>{
    console.log("Redis db connection error",err);
})

module.exports = redis;