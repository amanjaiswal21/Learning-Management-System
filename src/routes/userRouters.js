import express from 'express';
import{register,login,logout,getProfile,forgotPassword,resetPassword,changePassword,update} from '../controllers/user.controller.js'
import isLoggedIn from '../middlewares/auth.middlware.js';
import upload from "../middlewares/multer.middlewars.js"
const router=express.Router();

router.post('/register',upload.single('avatar'),register);
router.post('/login',login);
router.get('/logout',logout); 
router.get('/me',isLoggedIn,getProfile)
router.post('/reset',forgotPassword);
router.post('/reset/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassword);
router.put('/update',isLoggedIn,upload.single('avatar'),update)


export default router;