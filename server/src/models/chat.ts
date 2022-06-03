import mongoose, { Schema, Document, Model } from "mongoose";

interface IChat {
    [x: string]: any;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: {type: Date};
}

const userSchema: Schema<IChat> = new Schema({
    senderId: {
        type: String,
        required: true,
        trim: true
    },
    receiverId: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


const Chat = mongoose.model<IChat>("Chat", userSchema);
export default Chat;