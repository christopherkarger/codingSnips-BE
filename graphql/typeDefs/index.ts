import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    password: String
    createdSnips: [Snips!]
  }

  type Snips {
    _id: ID!
    title: String!
    text: String!
    creator: User!
  }

  input SnipsInput {
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
    snips(snipsId: ID!): [Snips]!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    createSnips(snipsInput: SnipsInput): Snips!
  }
`;
