const { v4: uuidv4, v4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Publication = require('../models/Publication');

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

module.exports = { publish, getPublications };
