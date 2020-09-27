import { Schema, Document, model } from "mongoose";

export interface ISnip extends Document {
  title: string;
  text: string;
  language: string;
  snipsCollection: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  _doc: any;
}

const snipSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  snipsCollection: {
    type: Schema.Types.ObjectId,
    ref: "SnipsCollection",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Snip = model<ISnip>("Snip", snipSchema);
