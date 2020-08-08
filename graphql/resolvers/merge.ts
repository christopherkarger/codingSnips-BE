const DataLoader = require("dataloader");
import { Snip } from "../../models/snip";
import { SnipsCollection } from "../../models/snips-collection";
import { User } from "../../models/user";

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const snipsLoader = new DataLoader((snipsIds) => {
  return Snip.find({ _id: { $in: snipsIds } });
});

const snipsCollectionsLoader = new DataLoader((snipsIds) => {
  return SnipsCollection.find({ _id: { $in: snipsIds } });
});

export const loadUser = async (userId) => {
  try {
    const user = await userLoader.load(userId);
    return {
      ...user._doc,
      snips: () => snipsLoader.loadMany(user._doc.snips),
      snipsCollections: () =>
        snipsCollectionsLoader.loadMany(user._doc.snipsCollections),
    };
  } catch (err) {
    throw err;
  }
};

export const loadSingleSnipsCollection = async (collectionId) => {
  try {
    const singleCollection: any = snipsCollectionsLoader.load(collectionId);
    return {
      ...singleCollection._doc,
    };
  } catch (err) {
    throw err;
  }
};

export const loadSnipsCollections = async (userId) => {
  try {
    const user: any = await User.findById(userId);
    const collections: any = await snipsCollectionsLoader.loadMany(
      user.snipsCollections
    );

    return collections.map((col) => {
      return {
        ...col._doc,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const loadSnips = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    const snips = await snipsLoader.loadMany(user.snips);
    return snips.map((snip) => {
      return {
        ...snip._doc,
      };
    });
  } catch (err) {
    throw err;
  }
};
