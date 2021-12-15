const {
  registerController,
  loginController,
} = require('../controllers/user');

const resolvers = {
  Query: {
    // User
    getUser: () => {
      console.log('Obtenido usuarios');
      return null;
    },
  },
  Mutation: {
    // User
    register: (_, { input }) => registerController(input),
    login: (_, { input }) => loginController(input),
  },
};

module.exports = resolvers;
