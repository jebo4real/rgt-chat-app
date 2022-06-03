import mongoose, { Schema, Document, Model } from "mongoose";

interface IBlockList {
  [x: string]: any;
  userId: string;
  list: [];
}

const userSchema: Schema<IBlockList> = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  list: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
});

const BlockList = mongoose.model<IBlockList>("BlockList", userSchema);
export default BlockList;
