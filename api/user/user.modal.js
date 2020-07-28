import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const userSchema = Schema({
    emailId:String,
    password:String,
}, { timestamps: {createdAt:'created_at'} })

export const Users = mongoose.model('userInfo',userSchema);