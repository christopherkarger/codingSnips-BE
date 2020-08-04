import { Schema, model } from "mongoose";

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

export const SnipsCollection = model("SnipsCollection", snipsCollectionSchema);
