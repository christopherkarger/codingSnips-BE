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
        language: args.snipInput.language,
        user: context.user,
        snipsCollection: args.snipInput.collectionId,
      });
      try {
        const userById = await User.findById(context.user);
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
        if (!snip) {
          throw new Error("Snip does not exist");
        }
        snip.text = args.snipInput.text;
        snip.title = args.snipInput.title;
        snip.language = args.snipInput.language;
        await snip.save();

        return {
          ...snip._doc,
        };
      } catch (err) {
        throw err;
      }
    },

    deleteSnip: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }

      try {
        const snip = await Snip.findById(args.snipId);
        if (!snip) {
          throw new Error("Snip does not exist");
        }
        const userById = await User.findById(context.user);
        const snipsCollection = await SnipsCollection.findById(
          snip.snipsCollection
        );

        await snip.remove();

        const indexOfSnipsAtUser = userById.snips.indexOf(args.snipId);
        userById.snips.splice(indexOfSnipsAtUser, 1);
        await userById.save();

        const indexOfSnipsAtSnipCollection = snipsCollection.snips.indexOf(
          args.snipId
        );
        snipsCollection.snips.splice(indexOfSnipsAtSnipCollection, 1);
        await snipsCollection.save();

        return {
          ...snip._doc,
          snipsCollection: () =>
            loadSingleSnipsCollection(snip._doc.snipsCollection),
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
