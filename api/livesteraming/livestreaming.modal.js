import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const liveStreamingSchema = Schema({
    userId:String,
    requestId:String,
    streamId:String
}, { timestamps: {createdAt:'created_at'} })

export const liveSchema = mongoose.model('livechat',liveStreamingSchema);