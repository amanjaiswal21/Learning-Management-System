import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";

const isLoggedin=async (req, res, next) => {
    const{token}=req.cookies;
    
    if(!token){
        return next(new AppError("you must login first",401))
    }
    const userDetails = await jwt.verify(token,process.env.JWT_SECRET)
    req.user=userDetails;
    next();
}
export default isLoggedin;