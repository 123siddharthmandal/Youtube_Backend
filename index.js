const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const userRouter = require('./routes/user.routes');
const channelRouter = require('./routes/channel.routes');
const videoRouter = require('./routes/video.routes');

const port = process.env.PORT || 4000;

// mongoose.connect(process.env.MONGO_URL).then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
// });

//endpoints
app.use(express.json());
app.use("/api", userRouter);
app.use("/api/channel", channelRouter);
app.use("/api/video", videoRouter);



app.listen(4000, () => {
    console.log(`Server is running on port : 4000`);
});