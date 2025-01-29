import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    optionSuccessStatus: 200,
    origin: ["https://job-posting-board-liart.vercel.app", "https://job-posting-board.skywaveapp.site","http://localhost:3000"]
}));
app.use(router);


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    }).catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err.message);
    });


app.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`Server has started on port ${process.env.PORT || 5000}`);
}) 