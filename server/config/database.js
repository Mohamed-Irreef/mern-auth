import mongoose from "mongoose";

const connectDb= async ()=>{
    try {
        const connect= await mongoose.connect(process.env.DB_URL);
        console.log(`Mongodb connected: Host-${connect.connection.host}, Port-${connect.connection.port} and Name-${connect.connection.name}`);
    } catch (error) {
        console.log(`Database Error: `, error);
        
    }
}
export default connectDb;