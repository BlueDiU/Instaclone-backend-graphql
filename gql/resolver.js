const userCtrl = require('../controllers/user');
const followCtrl = require('../controllers/follow');
const publicationCtrl = require('../controllers/publication');
const commentCtrl = require('../controllers/comment');
const likeCtrl = require('../controllers/like');
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
    getPublicationsFollowing: (_, {}, ctx) =>
      publicationCtrl.getPublicationsFollowing(ctx),

    // Comment
    getComments: (_, { idPublication }) =>
      commentCtrl.getComments(idPublication),

    // Like
    isLike: (_, { idPublication }, ctx) =>
      likeCtrl.isLike(idPublication, ctx),
    countLikes: (_, { idPublication }) =>
      likeCtrl.countLikes(idPublication),
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

    // Like
    addLike: (_, { idPublication }, ctx) =>
      likeCtrl.addLike(idPublication, ctx),
    deleteLike: (_, { idPublication }, ctx) =>
      likeCtrl.deleteLike(idPublication, ctx),
  },
};

module.exports = resolvers;
