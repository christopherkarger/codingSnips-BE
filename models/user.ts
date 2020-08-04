import { Schema, model } from "mongoose";

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

export const User = model("User", userSchema);
