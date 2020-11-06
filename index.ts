import { ApolloServer } from "apollo-server";
import context from "./context";
import { connect as mongooseConnect } from "mongoose";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

const MONGO_DB_URL = 'mongodb://127.0.0.1:27017';

async function bootstrap() {
  try {
    const mongoose = await mongooseConnect(MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Start Apollo Server
    const server = new ApolloServer({
      cors: true,
      typeDefs,
      resolvers,
      context,
    });

    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
