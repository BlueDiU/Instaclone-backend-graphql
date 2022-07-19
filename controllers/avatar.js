/* Models */
const User = require('../models/User');

/* libs */
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');

/* utils */
const uploadToCloudinary = require('../utils/uploadToCloudinary');

/* Upload an image to cloudinary */
async function updateAvatar(file, ctx) {
  const { id } = ctx.user;
  const { createReadStream } = await file;

  const fileStream = createReadStream();

  // get current user from MongoDB
  let user = await User.findById(id);

  // clean previous images
  if (user.avatar) {
    // delete the image of the server
    const nameArr = user.avatar.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.');

    /* Setting the cloudinary configuration. */
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    await cloudinary.uploader.destroy(
      `instaclone/avatars/${public_id}`
    );
  }

  try {
    /* upload image */
    result = await uploadToCloudinary(fileStream);

    //  save url in user id doc
    await User.findByIdAndUpdate(id, {
      avatar: result.secure_url,
    });

    return {
      status: true,
      urlAvatar: result.secure_url,
    };
  } catch (error) {
    console.log(error);
    return { status: false, urlAvatar: null };
  }
}

async function deleteAvatar(ctx) {
  const { id } = ctx.user;

  try {
    const user = await User.findById(id);

    /* Delete avatar from file system */
    if (user.avatar) {
      const nameArr = user.avatar.split('/');
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split('.');

      /* Setting the cloudinary configuration. */
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API,
        api_secret: process.env.CLOUDINARY_SECRET,
      });

      const resp = await cloudinary.uploader.destroy(
        `instaclone/avatars/${public_id}`
      );

      if (resp.result === 'ok') {
        await User.findByIdAndUpdate(id, { avatar: '' });
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/* UPLOAD IMAGES TO FILE SYSTEM */

async function updateAvatarFS(file, ctx) {
  const { id } = ctx.user;
  const { createReadStream, mimetype } = await file;
  const ext = mimetype.split('/')[1];
  const imageName = `${id}.${ext}`;
  const stream = createReadStream();

  const pathName = path.join(
    __dirname,
    `../upload/avatar/${imageName}`
  );

  // get current user from MongoDB
  let user = await User.findById(id);

  // clean previous images
  if (user.avatar) {
    // delete the image of the server
    const imgPath = path.join(
      __dirname,
      `../upload/avatar/${user.avatar}`
    );

    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  try {
    const img = await stream.pipe(
      fs.createWriteStream(pathName)
    );

    let avatarImg = '';

    if (img.path) {
      avatarImg = imageName;
    }

    // save url in user id doc
    await User.findByIdAndUpdate(id, { avatar: avatarImg });

    return {
      status: true,
      urlAvatar: avatarImg,
    };
  } catch (error) {
    console.log(error);
    return { status: false, urlAvatar: null };
  }
}

async function deleteAvatarFS(ctx) {
  const { id } = ctx.user;

  try {
    const user = await User.findById(id);

    /* Delete avatar from file system */
    if (user.avatar) {
      // delete the image of the server
      const imgPath = path.join(
        __dirname,
        `../upload/avatar/${user.avatar}`
      );

      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
        await User.findByIdAndUpdate(id, { avatar: '' });
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  updateAvatar,
  deleteAvatar,
};
