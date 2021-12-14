const { registerController } = require('../controllers/user');

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
    register: async (_, { input }) => registerController(input),
  },
};

module.exports = resolvers;
