const Follow = require('../models/Follow');
const User = require('../models/User');

async function follow(username, ctx) {
  const userFound = await User.findOne({ username });

  if (!userFound) throw new Error('Usuario no encontrado');

  try {
    const follow = new Follow({
      idUser: ctx.user.id,
      follow: userFound._id,
    });

    follow.save();

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isFollow(username, ctx) {
  const userFound = await User.findOne({ username });

  if (!userFound) throw new Error('Usuario no encontrado');

  /* create new record with my userId and the reference with the userId of the persona that be follow */
  const follow = await Follow.find({ idUser: ctx.user.id })
    .where('follow')
    .equals(userFound._id);

  if (follow.length > 0) {
    return true;
  }

  return false;
}

async function unFollow(username, ctx) {
  const userFound = await User.findOne({ username });

  /* delete a document with my userId, where the document has the userId of the person that want to unfollow  */
  const follow = await Follow.deleteOne({ idUser: ctx.user.id })
    .where('follow')
    .equals(userFound._id);

  console.log(follow);

  if (follow.deletedCount > 0) {
    return true;
  }

  return false;
}

async function getFollowers(username) {
  /* get user data */
  const user = await User.findOne({ username });
  /* get all records that in the follow prop are follow the given user (ID) */
  const followers = await Follow.find({
    follow: user._id,
  }).populate('idUser');

  const followersList = [];

  /* async for that wait the followers and create new array with that data */
  for await (const data of followers) {
    followersList.push(data.idUser);
  }

  return followersList;
}

async function getFollowing(username) {
  const user = await User.findOne({ username });

  const following = await Follow.find({
    idUser: user._id,
  }).populate('follow');

  let followingList = [];

  for await (data of following) {
    followingList.push(data.follow);
  }

  return followingList;
}

module.exports = {
  follow,
  isFollow,
  unFollow,
  getFollowers,
  getFollowing,
};
