import { SnipsCollection } from "../../models/snips-collection";
import {
  loadUser,
  loadSnips,
  loadSnipsCollections,
  loadSingleSnipsCollection,
} from "./merge";
import { User } from "../../models/user";

export const snipsCollectionResolver = {
  Query: {
    snipsCollections: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const snipsCollection = await loadSnipsCollections(context.user);
        return snipsCollection.map((coll: any) => {
          return {
            ...coll,
            snips: () => loadSnips(coll.snips),
            user: () => loadUser(coll.user),
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
        throw new Error("Authentication failed");
      }
      try {
        const snipsCollection = new SnipsCollection({
          title: args.title,
          user: context.user,
        });
        const savedSnipsCollection: any = await snipsCollection.save();

        const createdSnipsCollection = {
          ...savedSnipsCollection._doc,
          user: () => loadUser(savedSnipsCollection._doc.user),
        };

        const userById: any = await User.findById(context.user);

        if (!userById) {
          throw new Error("User does not exits");
        }

        userById.snipsCollections.push(createdSnipsCollection);
        await userById.save();
        return createdSnipsCollection;
      } catch (err) {
        throw err;
      }
    },

    updateSnipsCollectionName: async (parent, args, context) => {
      const collection: any = await SnipsCollection.findById(args.collectionId);
      collection.title = args.title;
      collection.save();
      return {
        ...collection._doc,
        user: () => loadUser(collection._doc.user),
      };
    },
  },
};
