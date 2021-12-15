const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

module.exports = { registerController, loginController };