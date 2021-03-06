import { Snip } from "../../models/snip";
import { User, IUser } from "../../models/user";
import {
  loadUser,
  loadSingleSnipsCollection,
  loadSnipsCollection,
} from "./merge";
import {
  SnipsCollection,
} from "../../models/snips-collection";
import { AUTH_FAILED } from "../../constants";

export const snipResolver = {
  Query: {
    favouriteSnips: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const userById = await User.findById(context.user);
        const snips = await Snip.find({ _id: { $in: userById.snips } });
        const favSnips = snips.filter((s) => s.favourite);
        return {
          snipsCount: favSnips.length,
          snips: favSnips.map((snip) => {
              return {
                ...snip._doc,
                snipsCollection: () => loadSnipsCollection(snip.snipsCollection),
              };
            })
        }
      } catch (err) {
        throw err;
      }
      
    },
    snips: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const userById = await User.findById(context.user);
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
        throw new Error(AUTH_FAILED);
      }

      try {
        const snipCollectionById = await SnipsCollection.findById(
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
        throw new Error(AUTH_FAILED);
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
        throw new Error(AUTH_FAILED);
      }
      const snip = new Snip({
        title: args.snipInput.title,
        text: args.snipInput.text,
        language: args.snipInput.language,
        favourite: args.snipInput.favourite,
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

        const savedSnip = await snip.save();
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
    
    updateSnipFavourite: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const snip = await Snip.findById(args.snipId);
        snip.favourite = args.favourite;
        const savedSnip = await snip.save();

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
        throw new Error(AUTH_FAILED);
      }

      try {
        const snip = await Snip.findById(args.snipInput.snipId);
        if (!snip) {
          throw new Error("Snip does not exist");
        }
        snip.text = args.snipInput.text;
        snip.title = args.snipInput.title;
        snip.language = args.snipInput.language;
        snip.favourite = args.snipInput.favourite;
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
        throw new Error(AUTH_FAILED);
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
