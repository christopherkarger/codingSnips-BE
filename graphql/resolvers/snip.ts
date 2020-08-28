import { Snip } from "../../models/snip";
import { User, IUser } from "../../models/user";
import {
  loadUser,
  loadSingleSnipsCollection,
  loadSnipsCollection,
} from "./merge";
import {
  SnipsCollection,
  ISnipsCollection,
} from "../../models/snips-collection";

export const snipResolver = {
  Query: {
    snips: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const userById: IUser = await User.findById(context.user);
        const snips = await Snip.find({ _id: { $in: userById.snips } });

        return snips.map((snip) => {
          return {
            ...snip._doc,
            snipsCollection: () => loadSnipsCollection(snip.snipsCollection),
          };
        });
      } catch (err) {
        throw err;
      }
    },
    snipsFromCollection: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const snipCollectionById: ISnipsCollection = await SnipsCollection.findById(
          args.collectionId
        );

        const snips = await Snip.find({
          _id: { $in: snipCollectionById.snips },
        });
        return snips.map((snip) => {
          return {
            ...snip._doc,
            snipsCollection: () => loadSnipsCollection(snip.snipsCollection),
          };
        });
      } catch (err) {
        throw err;
      }
    },

    snipDetails: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }

      try {
        const snip = await Snip.findById(args.snipId);
        return {
          ...snip._doc,
        };
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createSnip: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }

      const snip = new Snip({
        title: args.snipInput.title,
        text: args.snipInput.text,
        user: context.user,
        snipsCollection: args.snipInput.collectionId,
      });
      try {
        const userById = await User.findById(context.user);
        if (!userById) {
          throw new Error("User does not exits");
        }
        userById.snips.push(snip.id);
        await userById.save();

        const snipCollectionById = await SnipsCollection.findById(
          args.snipInput.collectionId
        );

        if (!snipCollectionById) {
          throw new Error("SnipCollection does not exits");
        }
        snipCollectionById.snips.push(snip.id);
        await snipCollectionById.save();

        const savedSnip: any = await snip.save();
        return {
          ...savedSnip._doc,
          user: () => loadUser(savedSnip._doc.user),
          snipsCollection: () =>
            loadSingleSnipsCollection(savedSnip._doc.snipsCollection),
        };
      } catch (err) {
        throw err;
      }
    },
    updateSnip: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }

      try {
        const snip = await Snip.findById(args.snipInput.snipId);
        snip.text = args.snipInput.text;
        snip.title = args.snipInput.title;
        await snip.save();

        return {
          ...snip._doc,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
