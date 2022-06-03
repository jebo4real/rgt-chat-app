import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser {
    [x: string]: any;
    email: string;
    userName: string;
}


const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        trim: true
    }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;