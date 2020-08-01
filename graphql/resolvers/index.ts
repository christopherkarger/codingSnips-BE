import { userResolver } from "./user";
import { snipsResolver } from "./snips";

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...snipsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...snipsResolver.Mutation,
  },
};
