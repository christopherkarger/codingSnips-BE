import { Schema, model } from "mongoose";

const snipsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Snips = model("Snips", snipsSchema);
