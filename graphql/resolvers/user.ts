import { hash, compare } from "bcryptjs";
import { User } from "../../models/user";
import { sign } from "jsonwebtoken";
import { AUTH_FAILED, USER_EXITS } from '../../constants';

export const userResolver = {
  Query: {
    login: async (parent, args, context) => {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new Error(AUTH_FAILED);
      }

      const pwIsEqual = await compare(args.password, user.password);

      if (!pwIsEqual) {
        throw new Error(AUTH_FAILED);
      }

      const token = sign(
        { userId: user._id, email: user.email },
        process.env.PW_SECRET,
        {
          expiresIn: "2h",
        }
      );

      return {
        userId: user._id,
        token: token,
        expiration: 2,
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
          throw new Error(USER_EXITS);
        }

        const pwd = await hash(args.password, 12);

        const user = new User({
          email: args.email,
          password: pwd,
        });

        const savedUser = await user.save();

        return { ...savedUser._doc, password: null };
      } catch (err) {
        throw err;
      }
    },
  },
};
