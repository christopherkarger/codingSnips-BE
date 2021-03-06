import {
  SnipsCollection,
} from "../../models/snips-collection";
import { loadSnips } from "./merge";
import { User, IUser } from "../../models/user";
import { Snip } from "../../models/snip";
import { AUTH_FAILED } from "../../constants";


export const snipsCollectionResolver = {
  Query: {
    snipsCollectionById: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const snipsCollection = await SnipsCollection.findById(
          args.collectionId
        );

        return {
          ...snipsCollection._doc,
          snips: () => loadSnips(snipsCollection.snips),
        };
      } catch (err) {
        throw err;
      }
    },

    snipsCollections: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }


      try {
        const userById = await User.findById(context.user);
        const snipsCollection = await SnipsCollection.find({
          _id: { $in: userById.snipsCollections },
        });

        return snipsCollection.map((coll: any) => {
          return {
            ...coll._doc,
            snipsCount: coll._doc.snips.length
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createSnipsCollection: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const snipsCollection = new SnipsCollection({
          title: args.title,
          user: context.user,
        });
        const savedSnipsCollection = await snipsCollection.save();

        const createdSnipsCollection = {
          ...savedSnipsCollection._doc,
        };

        const userById = await User.findById(context.user);

        userById.snipsCollections.push(createdSnipsCollection);
        await userById.save();
        return createdSnipsCollection;
      } catch (err) {
        throw err;
      }
    },

    updateSnipsCollectionName: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const collection = await SnipsCollection.findById(args.collectionId);
        collection.title = args.title;
        collection.save();
        return {
          ...collection._doc,
        };
      } catch (err) {
        throw err;
      }
    },

    deleteSnipsCollection: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(AUTH_FAILED);
      }

      try {
        const userById = await User.findById(context.user);
        const collection = await SnipsCollection.findById(args.collectionId);
        const indexOfCollection = userById.snipsCollections.indexOf(
          args.collectionId
        );
        userById.snipsCollections.splice(indexOfCollection, 1);

        const newSnips = userById.snips.filter(
          (x) => !collection.snips.includes(x)
        );

        userById.snips = newSnips;

        await userById.save();
        await Snip.deleteMany({ _id: { $in: collection.snips } });

        await SnipsCollection.remove({ _id: args.collectionId });

        return {
          ...collection._doc,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
