import dotenv from 'dotenv';
dotenv.config();


import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    fullName: {
        type: String,
        required: [true,"Name is required"],
        minLength: [5,"Name must be at least 5 characters"],
        maxLength: [50,"Name cannot be more than 50 characters"],
        trim: true,
      },
      email: {
        type: String,
        required: [true,"Email is required"],
        lowercase:true,
        unique: true,
        trim: true,
      //  match:[]
      },
      password: {
        type: String,
        required: [true,"Password is required"],
        minLength: [8,"Password must be at least 8 characters"],
        // maxLength: [30,"Password cannot be more than 30 characters"],
        select:false,
      },
      avtar:{
        public_id: {
            type: String,
      },
      secure_url:{
        type: String,
      }
    },
    role:{
        type:String,
        enum: ["user","admin"],
        default:"user"
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
  },
 {
    timestamps:true
 }
 )

 userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
     return next();
    }
    this.password=await bcrypt.hash(this.password,10);
 })


 userSchema.methods={
    generateJWTToken: async function(){
        return  jwt.sign({
            id:this._id,email:this.email,subscription:this.subscription,role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        })
    },
    comparePassword:async function(plainTextPassword){
     return bcrypt.compare(plainTextPassword,this.password)
    }

 }

const User=mongoose.model('User',userSchema);

export default User;