import express from 'express';
import{register,login,logout,getProfile} from '../controllers/user.controller.js'
import isLoggedIn from '../middlewares/auth.middlware.js';
import upload from "../middlewares/multer.middlewars.js"
const router=express.Router();

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.get('/logout',logout); 
router.get('/me',isLoggedIn,getProfile)
export default router;