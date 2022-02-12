const userCtrl = require('../controllers/user');
const followCtrl = require('../controllers/follow');
const publicationCtrl = require('../controllers/publication');
const commentCtrl = require('../controllers/comment');
const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    // User
    getUser: (_, { id, username }) =>
      userCtrl.getUser(id, username),
    search: (_, { search }) => userCtrl.search(search),

    // Follow
    isFollow: (_, { username }, ctx) =>
      followCtrl.isFollow(username, ctx),
    getFollowers: (_, { username }) =>
      followCtrl.getFollowers(username),
    getFollowing: (_, { username }) =>
      followCtrl.getFollowing(username),

    // Publication
    getPublications: (_, { username }) =>
      publicationCtrl.getPublications(username),

    // Comment
    getComments: (_, { idPublication }) =>
      commentCtrl.getComments(idPublication),
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
    unFollow: (_, { username }, ctx) =>
      followCtrl.unFollow(username, ctx),

    // Publish
    publish: (_, { file }, ctx) =>
      publicationCtrl.publish(file, ctx),

    // Comment
    addComment: (_, { input }, ctx) =>
      commentCtrl.addComment(input, ctx),
  },
};

module.exports = resolvers;
