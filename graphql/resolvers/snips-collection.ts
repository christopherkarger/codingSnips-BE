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
    snipsCollectionById: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const snipsCollection = await loadSingleSnipsCollection(
          args.collectionId
        );
        return {
          ...snipsCollection,
          snips: () => loadSnips(snipsCollection.snips),
        };
      } catch (err) {
        throw err;
      }
    },

    snipsCollections: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const snipsCollection = await loadSnipsCollections(context.user);
        return snipsCollection.map((coll: any) => {
          return {
            ...coll,
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
        };

        const userById: any = await User.findById(context.user);

        userById.snipsCollections.push(createdSnipsCollection);
        await userById.save();
        return createdSnipsCollection;
      } catch (err) {
        throw err;
      }
    },

    updateSnipsCollectionName: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const collection: any = await SnipsCollection.findById(
          args.collectionId
        );
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
        throw new Error("Authentication failed");
      }

      try {
        const userById: any = await User.findById(context.user);
        const indexOfCollection = userById.snipsCollections.indexOf(
          args.collectionId
        );
        userById.snipsCollections.splice(indexOfCollection, 1);
        await userById.save();

        const collection: any = await SnipsCollection.findById(
          args.collectionId
        );

        await collection.deleteOne({ _id: args.collectionId });

        return {
          ...collection._doc,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
