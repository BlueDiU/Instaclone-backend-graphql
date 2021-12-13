const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID
    name: String
    username: String
    email: String
    avatar: String
    webSite: String
    description: String
    password: String
    createdAt: String
  }

  type Query {
    # User
    getUser: User
  }
`;

module.exports = typeDefs;
