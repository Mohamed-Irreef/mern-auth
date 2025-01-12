import jwt from 'jsonwebtoken';

const verifyToken= async (req,res,next)=>{
    
    try {
        const token = req.cookies.token || req.headers.Authorization?.split(" ")[1] || req.headers.authorization?.split(" ")[1]; // in header, Authorization: Bearer your_jwt_token_here

        if (!token) {
            return res.status(401).json({ status: false, message: 'No token provided, please login again' });
        }
        const decodeToken = await jwt.verify(token,process.env.JWT_SECRET_KEY); // example: decodeToken = { id: '678286fff836c4a24e9f52a4', iat: 1736617523, exp: 1737222323 }
        // req.id=decodeToken; // req.id:'' will be added to req. example: it will pass req.id:'' along with req.body and move to next middleware
        req.token= decodeToken;
        next();
    } catch (error) {
        res.status(500).json({status:false,message:'Token Verification error'})
    }
    
}

export default verifyToken;