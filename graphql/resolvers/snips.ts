import { Snips } from "../../models/snips";
import { User } from "../../models/user";
import { loadUser } from "./merge";

export const snipsResolver = {
  Query: {
    snips: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      try {
        const snips = await Snips.find();
        return snips.map((snip: any) => {
          return {
            ...snip._doc,
            creator: () => loadUser(snip._doc.creator),
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createSnips: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      const snips = new Snips({
        title: args.snipsInput.title,
        text: args.snipsInput.text,
        creator: context.user,
      });
      try {
        const savedSnips: any = await snips.save();
        const createdSnips = {
          ...savedSnips._doc,
          creator: loadUser.bind(this, savedSnips._doc.creator),
        };
        const userById: any = await User.findById(context.user);
        if (!userById) {
          throw new Error("User does not exits");
        }
        userById.createdSnips.push(snips);
        await userById.save();
        return createdSnips;
      } catch (err) {
        throw err;
      }
    },
  },
};
