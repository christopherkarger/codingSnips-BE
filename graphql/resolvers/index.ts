import { userResolver } from "./user";
import { snipResolver } from "./snip";
import { snipsCollectionResolver } from "./snips-collection";
export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...snipResolver.Query,
    ...snipsCollectionResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...snipResolver.Mutation,
    ...snipsCollectionResolver.Mutation,
  },
};
