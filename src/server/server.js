import app from "../server/app.js";
import dotenv from 'dotenv';
dotenv.config();
import connectionToDB from "../config/dbConnection.js";
import cloudinary from 'cloudinary';

const PORT=5000;

//cloudinary configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});



app.listen(PORT,async()=>{
    await connectionToDB();
    console.log(`Server is running on port ${PORT}`)
})