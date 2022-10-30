const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typedefs");
const resolvers = require("./schema/resolvers");
const connectDb = require("./utils/db");
require("dotenv").config();

const server = new ApolloServer({ typeDefs, resolvers });

connectDb();

server.listen().then((data) => {
  console.log("server running");
});
