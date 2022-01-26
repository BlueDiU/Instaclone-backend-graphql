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

//TODO: Arreglar seguir a misma personas mucha veces
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

module.exports = {
  follow,
  isFollow,
  unFollow,
};
