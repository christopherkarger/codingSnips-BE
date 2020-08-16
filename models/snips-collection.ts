import { Schema, Document, model } from "mongoose";

export interface ISnipsCollection extends Document {
  title: string;
  snips: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId[];
  _doc: any;
}

const snipsCollectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  snips: [
    {
      type: Schema.Types.ObjectId,
      ref: "Snip",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const SnipsCollection = model<ISnipsCollection>(
  "SnipsCollection",
  snipsCollectionSchema
);
