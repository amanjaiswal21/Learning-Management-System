import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
//import { login } from "../controllers/user.controller.js";

const isLoggedin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        
        if (!token) {
            throw new AppError("You must log in first", 401);
        }
        
        const userDetails =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = userDetails;
        next();
    } catch (error) {
        // Handle JWT verification errors
        next(new AppError("Authentication failed. Please log in again.", 401));
    }
};

export default isLoggedin;
