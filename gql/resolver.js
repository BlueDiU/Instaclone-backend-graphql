const userCtrl = require('../controllers/user');
const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    // User
    getUser: (_, { id, username }) =>
      userCtrl.getUser(id, username),
    getAvatarImg: (_, params, ctx) => userCtrl.getAvatarImg(ctx),
  },
  Mutation: {
    // User
    register: (_, { input }) =>
      userCtrl.registerController(input),
    login: (_, { input }) => userCtrl.loginController(input),
    updateAvatar: (_, { file }, ctx) =>
      userCtrl.updateAvatar(file, ctx),
  },
};

module.exports = resolvers;
