import { ApolloServer } from "apollo-server";
import context from "./context";
import { connect as mongooseConnect } from "mongoose";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

// Start Apollo Server1
const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context,
  playground: true,
});

mongooseConnect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0aypw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => {
    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
