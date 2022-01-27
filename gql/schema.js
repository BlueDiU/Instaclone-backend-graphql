const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

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

  type Token {
    token: String
  }

  type UpdateAvatar {
    status: Boolean
    urlAvatar: String
  }

  # Datos que recibe la mutación al registro
  input UserInput {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserUpdateInput {
    name: String
    email: String
    currentPassword: String
    newPassword: String
    webSite: String
    description: String
  }

  type Query {
    # User
    getUser(id: ID, username: String): User
    search(search: String): [User]

    # Follow
    isFollow(username: String): Boolean
    getFollowers(username: String!): [User]
    getFollowing(username: String!): [User]
  }

  type Mutation {
    # User
    register(input: UserInput): User
    login(input: LoginInput): Token
    updateAvatar(file: Upload!): UpdateAvatar!
    deleteAvatar: Boolean
    updateUser(input: UserUpdateInput): Boolean

    # Follows
    follow(username: String!): Boolean
    unFollow(username: String!): Boolean
  }
`;

module.exports = typeDefs;
