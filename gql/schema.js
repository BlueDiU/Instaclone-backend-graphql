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

  # Datos que recibe la mutación al registro
  input UserInput {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    # User
    getUser: User
  }

  type Mutation {
    # User
    register(input: UserInput): User
  }
`;

module.exports = typeDefs;
