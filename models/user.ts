import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Events",
    },
  ],
});

export const User = model("User", eventSchema);
