const User = require('../models/User');
const bcryptjs = require('bcryptjs');

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

module.exports = { registerController };
