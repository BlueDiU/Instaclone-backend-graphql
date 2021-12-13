const resolvers = {
  Query: {
    // User
    getUser: () => {
      console.log('Obtenido usuarios');
      return null;
    },
  },
};

module.exports = resolvers;
