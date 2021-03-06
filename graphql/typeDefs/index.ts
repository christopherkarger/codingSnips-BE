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
    snipsCount: Int!
    user: User
    snips: [Snip]
  }

  type FavouriteSnips {
    snipsCount: Int!
    snips: [Snip]!
  }

  type Snip {
    _id: ID!
    title: String!
    text: String!
    language: String!
    favourite: Boolean!
    user: User
    snipsCollection: SnipsCollection
  }

  input CreateSnipInput {
    collectionId: String!
    title: String!
    text: String!
    language: String!
    favourite: Boolean!
  }

  input UpdateSnipInput {
    snipId: String!
    title: String!
    text: String!
    language: String!
    favourite: Boolean!
  }

  type AuthData {
    userId: ID!
    token: String!
    expiration: Int!
  }

  type Query {
    login(email: String!, password: String!): AuthData!
    snipsCollections: [SnipsCollection]!
    snipsCollectionById(collectionId: String!): SnipsCollection!
    snips: [Snip]!
    favouriteSnips: FavouriteSnips!
    snipsFromCollection(collectionId: String!): [Snip]!
    snipDetails(snipId: String!): Snip!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    createSnipsCollection(title: String!): SnipsCollection!
    updateSnipsCollectionName(
      collectionId: String!
      title: String!
    ): SnipsCollection!
    createSnip(snipInput: CreateSnipInput!): Snip!
    deleteSnipsCollection(collectionId: String!): SnipsCollection!
    updateSnip(snipInput: UpdateSnipInput!): Snip!
    deleteSnip(snipId: String!): Snip!
    updateSnipFavourite(snipId: String!, favourite: Boolean!): Snip!
  }
`;
