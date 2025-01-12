import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyCode:{type:String,default:''},
    verifyCodeExpireAt:{type:Number,default:0},
    isVerifed:{type:Boolean,default:false},
},{timestamps:true});

const userModel= mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;