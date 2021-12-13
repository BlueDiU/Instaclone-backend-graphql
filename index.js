const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');

require('dotenv').config({ path: '.env' });

// DB CONN
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('DB Connection Succesfull!');
    server();
  })
  .catch((err) => console.log(err));

// APOLLO CONN
function server() {
  const serverApollo = new ApolloServer({ typeDefs, resolvers });

  serverApollo.listen().then(({ url }) => {
    console.log(`Server listening in PORT ${url}`);
  });
}
