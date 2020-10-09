import { ApolloServer } from "apollo-server";
import context from "./context";
import { connect as mongooseConnect } from "mongoose";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

const MONGO_DB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0aypw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

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
