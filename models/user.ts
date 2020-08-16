import { Schema, Document, model } from "mongoose";
import { ISnip } from "./snip";
import { ISnipsCollection } from "./snips-collection";

export interface IUser extends Document {
  email: string;
  password?: string;
  snips: ISnip[];
  snipsCollections: ISnipsCollection[];
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
