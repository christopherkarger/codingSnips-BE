import gql from "graphql-tag";

export const typeDefs = gql`
  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatetAt: String!
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: String!
    date: String!
    creator: User!
  }

  input EventInput {
    title: String!
    description: String!
    price: String!
    date: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  type AuthData {
    userId: ID!
    token: String!
    expiration: Int!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    createEvent(eventInput: EventInput!): Event!
    createUser(userInput: UserInput!): User!
    bookEvent(eventId: ID!): Booking!
    cancelEvent(bookingID: ID!): Booking!
    cancelBooking(eventId: ID!): Booking!
  }
`;
