import { userResolver } from "./user";
import { bookingsResolver } from "./bookings";
import { eventsResolver } from "./events";

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...bookingsResolver.Query,
    ...eventsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...bookingsResolver.Mutation,
    ...eventsResolver.Mutation,
  },
};
