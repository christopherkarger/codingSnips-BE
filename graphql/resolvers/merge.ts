const DataLoader = require("dataloader");
import { Snips } from "../../models/snips";
import { User } from "../../models/user";

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const snipsLoader = new DataLoader((snipsIds) => {
  return Snips.find({ _id: { $in: snipsIds } });
});

export const loadUser = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdSnips: () => snipsLoader.loadMany(user._doc.createdSnips),
    };
  } catch (err) {
    throw err;
  }
};
