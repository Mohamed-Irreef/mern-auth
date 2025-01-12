import express from 'express'
import { login, logout, passwordReset, register, sendVerifyCode, verifyCode } from '../controllers/userController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const authRouter= express.Router();

authRouter.post('/register',register);
authRouter.post('/login', login);
authRouter.post('/send-code',sendVerifyCode);
authRouter.post('/verify-code',verifyCode);
authRouter.post('/reset-password',passwordReset);
authRouter.post('/logout',verifyToken, logout);

export default authRouter;