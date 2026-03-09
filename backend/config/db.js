import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://greatstack:Ayushi123@cluster0.an6awty.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}