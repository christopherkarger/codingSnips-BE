import { Snip } from "../../models/snip";
import { User } from "../../models/user";
import { loadUser, loadSingleSnipsCollection } from "./merge";
import { SnipsCollection } from "../../models/snips-collection";

export const snipResolver = {
  Query: {
    snips: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication failed");
      }
      try {
        const snips = await Snip.find();
        return snips.map((snip: any) => {
          return {
            ...snip._doc,
            user: () => loadUser(snip._doc.creator),
            snipsCollection: () =>
              loadSingleSnipsCollection(snip._doc.snipsCollection),
          };
        });
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
      const snips = new Snip({
        title: args.snipInput.title,
        text: args.snipInput.text,
        user: context.user,
        snipsCollection: args.snipInput.snipsCollectionId,
      });
      try {
        const userById: any = await User.findById(context.user);
        if (!userById) {
          throw new Error("User does not exits");
        }
        userById.snips.push(snips);
        await userById.save();

        const snipCollectionById: any = await SnipsCollection.findById(
          args.snipInput.snipsCollectionId
        );

        if (!snipCollectionById) {
          throw new Error("SnipCollection does not exits");
        }
        snipCollectionById.snips.push(snips);
        await snipCollectionById.save();

        const savedSnip: any = await snips.save();
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
  },
};
