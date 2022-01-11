const mongoose = require('mongoose');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
const jwt = require('jsonwebtoken');

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
async function server() {
  const serverApollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization;

      if (token) {
        try {
          const user = jwt.verify(
            token.replace('Bearer ', ''),
            process.env.SECRET_KEY
          );

          return {
            user,
          };
        } catch (error) {
          console.log(' #### ERROR #### ');
          console.log(error);
          throw new Error('Invalid token');
        }
      }
    },
  });
  await serverApollo.start();

  const app = express();

  app.use(graphqlUploadExpress());

  serverApollo.applyMiddleware({ app });
  await new Promise((r) =>
    app.listen({ port: process.env.PORT || 4000 }, r)
  );

  console.log(
    '#############################################################'
  );
  console.log(
    `🚀 Server is listening in port http://localhost:4000${serverApollo.graphqlPath}`
  );
  console.log(
    '#############################################################'
  );
}
