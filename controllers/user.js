const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { Error } = require('mongoose');

function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;

  const payload = {
    id,
    name,
    email,
    username,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function registerController(input) {
  const newUser = input;
  newUser.email = newUser.email.toLowerCase();
  newUser.username = newUser.username.toLowerCase();

  const { email, username, password } = newUser;

  // Revisamos si el email ya esta en uso
  const foundEmail = await User.findOne({ email });
  if (foundEmail) throw new Error('El email  ya esta en uso');

  // Revisamos si el usuario ya esta en uso
  const foundUsername = await User.findOne({ username });
  if (foundUsername)
    throw new Error('El nombre de usuario ya esta en uso');

  // Encriptar
  const salt = await bcryptjs.genSaltSync(10);
  newUser.password = await bcryptjs.hash(password, salt);

  try {
    const user = new User(newUser);
    user.save();
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function loginController(input) {
  const { email, password } = input;

  const userFound = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!userFound)
    throw new Error('Correo o contraseña no validos');

  const passwordSuccess = await bcryptjs.compare(
    password,
    userFound.password
  );

  if (!passwordSuccess)
    throw new Error('Correo o contraseña no validos');

  return {
    token: createToken(userFound, process.env.SECRET_KEY, '24h'),
  };
}

async function getUser(id, username) {
  let user = null;

  if (id) user = await User.findById(id);

  if (username) user = await User.findOne({ username });

  if (!user) throw new Error('El usuario no existe');

  return user;
}

async function updateAvatar(file, ctx) {
  const { id } = ctx.user;
  const { createReadStream, mimetype } = await file;
  const ext = mimetype.split('/')[1];
  const imageName = `${id}.${ext}`;
  const stream = createReadStream();

  const pathName = path.join(
    __dirname,
    `../upload/avatar/${imageName}`
  );
  //`/upload/avatar/${imageName}`

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

async function deleteAvatar(ctx) {
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

async function updateUser(input, ctx) {
  const { id } = ctx.user;

  try {
    if (input.currentPassword && input.newPassword) {
      // change password
      const userFound = await User.findById(id);
      const passwordSuccess = await bcryptjs.compare(
        input.currentPassword,
        userFound.password
      );

      if (!passwordSuccess)
        throw new Error('Contraseña incorrecta');

      /* Encrypt new password and update password in db */
      const salt = await bcryptjs.genSaltSync(10);
      const newPasswordCrypt = await bcryptjs.hash(
        input.newPassword,
        salt
      );

      await User.findByIdAndUpdate(id, {
        password: newPasswordCrypt,
      });
    } else {
      await User.findByIdAndUpdate(id, input);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function search(search) {
  const users = await User.find({
    name: { $regex: search, $options: 'i' },
  });

  return users;
}

module.exports = {
  registerController,
  loginController,
  getUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
  search,
};
