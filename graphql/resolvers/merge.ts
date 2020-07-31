const DataLoader = require("dataloader");
import { Event } from "../../models/event";
import { User } from "../../models/user";

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const eventLoader = new DataLoader((eventIds) => {
  return Event.find({ _id: { $in: eventIds } });
});

export const events = async (eventIds) => {
  const events = await eventLoader.load(eventIds);
  try {
    return events.map((event) => {
      return {
        ...event._doc,
        creator: () => loadUser(event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const loadUser = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

export const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return {
      ...event._doc,
      creator: () => loadUser(event.creator),
    };
  } catch (err) {
    throw err;
  }
};
