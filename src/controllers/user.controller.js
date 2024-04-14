import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
const cookieOptions = {
    maxAge:7*24*60*60*1000, //7 days
    httpOnly:true,
    secure:true,
}

const register=async(req,res,next)=>{

const {fullName,email,password} = req.body;
if(!fullName || !email || !password){
    return next(new AppError("Allfields must be requires",400));
}

const userExist=await User.findOne({email})
if(userExist){
    return next(new AppError("email already exist",400));
}
 const user=await User.create({
    fullName,
    email,
    password,
    avtar:{
        public_id: " ",
        secure_url: ""
    }
 })
if(!user){
    return next(new AppError("user registration failed,please try again",500));
}

//TODO:File upload


if (req.file) {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.avtar.public_id = result.public_id;
        user.avtar.secure_url = result.secure_url;

        // Remove file from server
        await fs.rm(req.file.path);

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return next(new AppError("File upload failed, please try again later", 500));
    }
}



await user.save();

user.password = undefined;

const token=await user.generateJWTToken();

res.cookie('token',token,cookieOptions)
res.status(201).json({
    success: true,
    message:'user register successfully',
    user,
})

};



const login=async (req,res,next)=>{
    try{
        
        const{email,password}=req.body;
        console.log(email,password);
        if(!email ||!password){
            return next(new AppError("Allfields must be requires",400));
        }
        const user =await User.findOne({email}).select('+password');//plus isliye kiya hai mujhe explicitily password magna padega hamne model me password ko select false kiya hai
        
        
        if(!user|| !user.comparePassword(password)){
            return next(new AppError("email or password mismatch",400))
        }
        const token=await user.generateJWTToken();
        user.password = undefined;
        
        res.cookie('token',token,cookieOptions)
        
        res.status(200).json({
            success: true,
            message:'user loggedin successfully',
            user,
        })
    }catch(err){
        return next(new AppError(err.message,500))
    }

}


const logout=(req,res)=>{
res.cookie('token',null,
     {secure:true,
       maxAge:0,
       httpOnly:true
    })
    res.status(200).json({
        success: true,
        message:'user logged out successfully',
    })
};

const getProfile=async (req,res)=>{
    try{
        const userId=req.user.id;
       
        const user=await User.findById(userId);
        res.status(200).json({
            success: true,
            message:'user profile fetched successfully',
            user,
        })
    }catch(e){
    return next(new AppError("failed to fetch user profile",500))
    }
};

const forgotPassword=async(req,res,next)=>{
    const {email}=req.body;
    if(!email)
    return next(new AppError("email Id required",400))
 
    const user=await User.findOne({email});
    if(!user){
        return next(new AppError("Email Id not registered",500))
    }

    const resetToken=await user.generatePasswordResetToken();
   
    await user.save();

    const resetPasswordURL=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    
    console.log(resetPasswordURL);

    const subject='Reset Password';
    const message= `You can reset your password by clicking <ahref=${resetPasswordURL} target="_blank"> Reset your password </a> \n if the above link does not work for some reason then copy paste the URL in new tab ${resetPasswordURL}.\n If you have not requested this , kindly Ignore`;


    try {
        await sendEmail(email,subject,message);

        res.status(200).json({
            success: true,
            message:`Reset password token has been sent to ${email} successfully`
        })
    } catch (e) {
        console.log(e.message);
        user.forgotPasswordExpiry=undefined;
        user.forgotPasswordExpiry = undefined

        await user.save();
        
        return next(new AppError(e.message,500))
    }

}


const resetPassword=async (req, res,next)=>{
  const {resetToken} = req.params;

  const {password}=req.body;

  const forgotPasswordToken =crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        const user=await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry:{$gt:Date.now()}
        });

        if(!user){
         return next(new AppError('Token is invalid or expired. Please try again',400))
        }

        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry= undefined;

         user.save();

         res.status(200).json({
            success: true,
            message: 'Password changed successfully'
         })

}

const changePassword=async (req, res,next) => {
   const {oldPassword,newPassword}=req.body;
   const {id}=req.user;

   if(!oldPassword || !newPassword){
    return next(new AppError('All fields are mandatory',400))
   }

   const user = await User.findById(id).select(+password)
   
   
    if(!user){
        return next(new AppError('User doesnot exist',400))
       }
   
       const isPasswordValid=await User.comparePassword(oldPassword);

       if(!isPasswordValid){
        return next(new AppError('Invalid Old Password',400))
       }

       user.password=newPassword;
       await user.save();

       user.password=undefined;

       res.status(200).json({
        success:true,
        message:'Password changed successfully'
       })
}

const update=async(req, res, next) => {
    const {fullName} = req.body;
    const {id}=req.user.id;

    const user=await User.findById(id);
    
    if(!user){
        return next(new AppError('User doesnot exist',400))
    }
}

export{
    register,
    login,
    logout, 
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    update
}