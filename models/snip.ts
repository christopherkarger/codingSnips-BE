import { Schema, model } from "mongoose";

const snipSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
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

export const Snip = model("Snip", snipSchema);
