const { v4: uuidv4, v4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Publication = require('../models/Publication');
const Follow = require('../models/Follow');

async function publish(file, ctx) {
  const {
    user: { id },
  } = ctx;
  const { createReadStream, mimetype } = await file;
  const ext = mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${ext}`;
  const stream = createReadStream();

  const pathName = path.join(
    __dirname,
    `../upload/publication/${fileName}`
  );

  try {
    const img = await stream.pipe(
      fs.createWriteStream(pathName)
    );

    let avatarImg = '';

    if (img.path) {
      avatarImg = fileName;
    }

    // save url in publication doc
    const publication = new Publication({
      idUser: id,
      file: avatarImg,
      typeFile: mimetype.split('/')[0],
      createAt: Date.now(),
    });

    publication.save();

    return {
      status: true,
      urlFile: avatarImg,
    };
  } catch (error) {
    console.log(error);
    return { status: false, urlFile: '' };
  }
}

async function getPublications(username) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('User not found');
  }

  const publication = await Publication.find()
    .where({ idUser: user._id })
    .sort({ createAt: -1 });

  return publication;
}

async function getPublicationsFollowing(ctx) {
  /* Get all user that are follow me */
  const following = await Follow.find({
    idUser: ctx.user.id,
  }).populate('follow');

  const followingList = [];

  /* Creata array with the user */
  for await (const data of following) {
    followingList.push(data.follow);
  }

  const publicationList = [];

  /* 
    take  userArray and iterate to get all publications for each user
    and sort for the most recent publications added
  */
  for await (const data of followingList) {
    publications = await Publication.find()
      .where({ idUser: data._id })
      .sort({ createAt: -1 })
      .populate('idUser');

    /* Spread the array and get only the objects */
    publicationList.push(...publications);
  }

  /* sort by publications by date the highest to lowest */
  const result = publicationList.sort((a, b) => {
    return new Date(b.createAt) - new Date(a.createAt);
  });

  return result;
}

module.exports = {
  publish,
  getPublications,
  getPublicationsFollowing,
};
