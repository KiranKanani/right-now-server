import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const notifiactionSchema = Schema({
    mobileToken:String,
    userId:String
}, { timestamps: {createdAt:'created_at'} })

export const FirebaseNotification = mongoose.model('FirebaseNotification',notifiactionSchema);