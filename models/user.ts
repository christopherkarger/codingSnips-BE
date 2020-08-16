import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  snips: Schema.Types.ObjectId[];
  snipsCollections: Schema.Types.ObjectId[];
  _doc: any;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  snips: [
    {
      type: Schema.Types.ObjectId,
      ref: "Snip",
    },
  ],
  snipsCollections: [
    {
      type: Schema.Types.ObjectId,
      ref: "SnipsCollection",
    },
  ],
});

export const User = model<IUser>("User", userSchema);
