import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    password: String
    snips: [Snip]!
    snipsCollections: [SnipsCollection]!
  }

  type SnipsCollection {
    _id: ID!
    title: String!
    user: User!
    snips: [Snip]!
  }

  type Snip {
    _id: ID!
    title: String!
    text: String!
    user: User!
    snipsCollection: SnipsCollection!
  }

  input SnipInput {
    snipsCollectionId: ID!
    title: String!
    text: String!
  }

  type AuthData {
    userId: ID!
    token: String!
    expiration: Int!
  }

  type Query {
    login(email: String!, password: String!): AuthData!
    snipsCollections: [SnipsCollection]!
    snips(snipId: ID!): [Snip]!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    createSnipsCollection(title: String!): SnipsCollection!
    createSnip(snipInput: SnipInput): Snip!
  }
`;
