import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDb from './config/database.js';
import authRouter from './routes/authRoutes.js';

const app= express();
dotenv.config();
const PORT= process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true}));

app.use(cookieParser());
app.use('/api/auth',authRouter);

// Database Connection
connectDb();

// Request and Responses
app.get('/',(req,res)=>{
    res.send(`Server is running on the port ${PORT}`);
})

// Starting the Server
app.listen(PORT, (err) => {
    if (err) console.log(`Server Error : ${err}`);
  console.log(`Server is running on the port ${PORT}`);
});
