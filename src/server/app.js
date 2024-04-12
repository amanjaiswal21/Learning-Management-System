import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
import morgan from 'morgan';

import userRouter from '../routes/userRouters.js'
import errorMiddleware from '../middlewares/error.middlware.js';
dotenv.config();

const app = express(); 
 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser());


//morgan gives info in console about which route we access
app.use(morgan('dev'))

app.use('/ping', (req, res) => {
    res.send('/pong');
});

app.use('/api/v1/user',userRouter)
// Handle 404 errors
app.all('*', (req, res) => {
    res.status(404).send('OOPS!! 404 Not Found');
});

app.use(errorMiddleware);
export default app;
