import { bcrypt } from "bcryptjs";
import { User } from "../../models/user";
import { sign } from "jsonwebtoken";

export const userResolver = {
  Query: {
    login: async (parent, args, context) => {
      const user: any = await User.findOne({ email: args.email });

      if (!user) {
        throw new Error("User not found");
      }

      const pwIsEqual = await bcrypt.compare(args.password, user.password);
      if (!pwIsEqual) {
        throw new Error("Password is not correct");
      }

      const token = sign({ userId: user.id, email: user.email }, "secretKey", {
        expiresIn: "1h",
      });

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
          email: args.userInput.email,
        });

        if (foundUser) {
          throw new Error("User already exits");
        }

        const pwd = await bcrypt.hash(args.userInput.password, 12);

        const user = new User({
          email: args.userInput.email,
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
