import { hash, compare } from "bcryptjs";
import { User } from "../../models/user";
import { sign } from "jsonwebtoken";

export const userResolver = {
  Query: {
    login: async (parent, args, context) => {
      const user: any = await User.findOne({ email: args.email });

      if (!user) {
        throw new Error("Authentification failed");
      }

      const pwIsEqual = await compare(args.password, user.password);
      if (!pwIsEqual) {
        throw new Error("Authentification failed");
      }

      const token = sign(
        { userId: user.id, email: user.email },
        process.env.PW_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return {
        userId: user.id,
        token: token,
        expiration: 1,
      };
    },
  },
  Mutation: {
    createUser: async (parent, args, context) => {
      try {
        const foundUser = await User.findOne({
          email: args.email,
        });

        if (foundUser) {
          throw new Error("User already exits");
        }

        const pwd = await hash(args.password, 12);

        const user = new User({
          email: args.email,
          password: pwd,
        });

        const savedUser: any = await user.save();
        return { ...savedUser._doc, password: null };
      } catch (err) {
        throw err;
      }
    },
  },
};
