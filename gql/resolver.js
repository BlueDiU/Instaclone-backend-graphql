const userCtrl = require('../controllers/user');

const resolvers = {
  Query: {
    // User
    getUser: (_, { id, username }) =>
      userCtrl.getUser(id, username),
  },
  Mutation: {
    // User
    register: (_, { input }) =>
      userCtrl.registerController(input),
    login: (_, { input }) => userCtrl.loginController(input),
    updateAvatar: (_, { file }) => userCtrl.updateAvatar(file),
  },
};

module.exports = resolvers;
