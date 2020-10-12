import { Schema, Document, model } from "mongoose";

export interface ISnipsCollection extends Document {
  title: string;
  snipsCount: number;
  snips: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId[];
  _doc: any;
}

const snipsCollectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  snipsCount: {
    type: Number
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
