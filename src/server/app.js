import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from '../routes/userRouters.js'
import errorMiddleware from '../middlewares/error.middlware.js';
dotenv.config();

const app = express(); 
 
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));
app.use(cookieParser());
  
app.use('/ping', (req, res) => {
    res.send('/pong');
});

app.use('/api/v1/user',userRouter)
// Handle 404 errors
app.all('*', (req, res) => {
    res.status(404).send('OOPS! Not Found');
});

app.use(errorMiddleware);
export default app;
