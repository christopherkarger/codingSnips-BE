import { Booking } from "../../models/booking";
import { Event } from "../../models/event";
import { loadUser, singleEvent } from "./merge";

export const bookingsResolver = {
  Query: {
    bookings: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      try {
        const bookings: any = await Booking.find();
        return bookings.map((booking) => {
          return {
            ...booking._doc,
            user: () => loadUser(booking._doc.user),
            event: () => singleEvent(booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString(),
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    bookEvent: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      try {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });

        const booking: any = new Booking({
          user: "5f17edd3d7770865ebc5644c",
          event: fetchedEvent,
        });

        const result: any = await booking.save();
        return {
          ...result._doc,
          user: loadUser.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString(),
        };
      } catch (err) {
        throw err;
      }
    },
    cancelEvent: async (parent, args, context) => {
      try {
        const booking: any = await Booking.findById(args.eventId).populate(
          "event"
        );
        await Booking.deleteOne({ _id: args.bookingId });
        return {
          ...booking.event._doc,
          creator: loadUser.bind(this, booking.event._doc.creator),
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
