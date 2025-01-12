import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// Register Request: username, email,password
export const register= async (req,res)=>{

    // getting username from req
    const {username,email,password} = req.body;
    // checking any missing detail in the req
    if(!username || !email || !password){
        return res.status(409).json({status:false, message:'Missing details'});
    }

    // try catch block
    try {
        // checking, is User already exist
        const user= await userModel.findOne({email});
        if(user){
            return res.status(400).json({status:false, message:'Email already exist'});
        }
        // hassing the password and storing the user details in a database
        const hassedPassword= await bcrypt.hash(password,10);
        const newUser= new userModel({username,email,password:hassedPassword});
        await newUser.save();

        // success mail after successful registration
        const transporter= nodemailer.createTransport({
            host:process.env.SMTP_SERVER,
            port:process.env.SMTP_PORT,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS,
            }
        })
        const mailOptions={
            from:process.env.SENDER_MAIL,
            to: email,
            subject: `Registration Successful - University Portal`,
            text:`Hi ${username}, your ${email} has been registerd successfully on our University registration portal.`
        }
        await transporter.sendMail(mailOptions);

        // setting token in cookie
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', // Send over HTTPS only in production
            sameSite: 'strict', // Prevents CSRF attacks
            maxAge: 7*24*60*60*1000
        });

        // successfull registration response
        res.status(200).json({status: true,message:`Registration successful`});

    } catch (error) {
        res.status(500).json({status:false, message:'Invalid Registration'});
    }
}

// Login Request: email,password
export const login = async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(409).json({status:false, message:'Missing details'});
    }

    try {
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(400).json({status:false, message:'Email Id not exist'});
        }

        const isPasswordCorrect= await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(409).json({status:false, message:'Incorrect password'});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            maxAge: 7*24*60*60*1000
        });
        
        res.status(200).json({status:true,message:'Login successfull',token})
    } catch (error) {
        return res.status(500).json({status:false, message:'Invalid Login'});
    }
}

// sendVerifyCode Request: email
export const sendVerifyCode = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(409).json({status:false, message:'Missing details'});
    }
    try {
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(400).json({status:false, message:'Email Id not exist'});
        }
        
        
            const codeGenerator = String(Math.floor(100000 + Math.random()*900000));
            user.verifyCode= codeGenerator;
            user.verifyCodeExpireAt = Date.now() + 5*60*1000; //Expire in 5 minutes
            user.isVerifed ="false";
            await user.save();

            // send 6 digit code in mail
            const transporter= nodemailer.createTransport({
                host:process.env.SMTP_SERVER,
                port:process.env.SMTP_PORT,
                auth:{
                    user:process.env.SMTP_USER,
                    pass:process.env.SMTP_PASS,
                }
            })
            const mailOptions={
                from:process.env.SENDER_MAIL,
                to: email,
                subject: `Email Verification - University Portal`,
                text:`Hi ${user.username}, your otp is ${user.verifyCode}. Please, verify your email and reset your password using this otp.`
            }
            await transporter.sendMail(mailOptions);

            res.status(200).json({status:true, message:'Email verification code has been sent'})
        

    } catch (error) {
        return res.status(500).json({status:false, message:'Verifivation Error'});
    }
}

// verifyCode Request: email,otp
export const verifyCode = async (req,res)=>{
    const {email,otp} = req.body;
    if(!email || !otp){
        return res.status(409).json({status:false, message:'Missing details'});
    }

    try {
        const user= await userModel.findOne({email});
        
        if(otp !== user.verifyCode || user.verifyCode==="")
        {
            return res.status(409).json({status:false, message:'Incorrect otp'});
        }

        if(user.verifyCodeExpireAt < Date.now()){
            user.verifyCode="";
            user.verifyCodeExpireAt=0;
            await user.save();
            return res.status(400).json({status:false, message:'OTP expired'});
        }
        
        user.verifyCode="";
        user.verifyCodeExpireAt=0;
        user.isVerifed ="true";
        await user.save();

        res.status(201).json({status:true, message:'Email verified successfully'});

    } catch (error) {
        return res.status(500).json({status:false, message:'Verifivation Error'});
    }
}

// passwordReset request: email,newPassword,confirmPassword
export const passwordReset = async (req,res)=>{
    const {email,newPassword,confirmPassword} = req.body;
    
    if(!email || !newPassword || !confirmPassword){
        return res.status(409).json({status:false, message:'Missing details'});
    }

    try {
        const user= await userModel.findOne({email});
        
        const isSamePassword= await bcrypt.compare(newPassword,user.password);
        if(isSamePassword){
            return res.status(409).json({status:false, message:'Entered the previous password, try new password'});
        }
        if(newPassword !== confirmPassword){
            return res.status(409).json({status:false, message:"Password didn't match"});
        }

        const newHassedPassword= await bcrypt.hash(newPassword,10);
        user.password= newHassedPassword;
        await user.save();

        // reset password success full mail
        const transporter= nodemailer.createTransport({
            host:process.env.SMTP_SERVER,
            port:process.env.SMTP_PORT,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS,
            }
        })
        const mailOptions={
            from:process.env.SENDER_MAIL,
            to: email,
            subject: `Reset password Successful - University Portal`,
            text:`Hi ${user.username}, your password has been reset successfully. Please, login and continue.`
        }
        await transporter.sendMail(mailOptions);

        res.status(201).json({status:true, message:'password reset successful'})
    } catch (error) {
        return res.status(500).json({status:false, message:'Reset password Error'});
    }
}

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite:'Strict'
        })
        res.status(200).json({status:true,message:`Logout successfully`});
    } catch (error) {
        return res.status(500).json({status:false, message:'Logout Error'});
    }
}