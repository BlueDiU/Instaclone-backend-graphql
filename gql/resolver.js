const userCtrl = require('../controllers/user');
const followCtrl = require('../controllers/follow');
const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    // User
    getUser: (_, { id, username }) =>
      userCtrl.getUser(id, username),
    search: (_, { search }) => userCtrl.search(search),
  },
  Mutation: {
    // User
    register: (_, { input }) =>
      userCtrl.registerController(input),
    login: (_, { input }) => userCtrl.loginController(input),
    updateAvatar: (_, { file }, ctx) =>
      userCtrl.updateAvatar(file, ctx),
    deleteAvatar: (_, {}, ctx) => userCtrl.deleteAvatar(ctx),
    updateUser: (_, { input }, ctx) =>
      userCtrl.updateUser(input, ctx),

    // Follow
    follow: (_, { username }, ctx) =>
      followCtrl.follow(username, ctx),
  },
};

module.exports = resolvers;
