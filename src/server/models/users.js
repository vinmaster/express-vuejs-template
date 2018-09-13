const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    lastLoginAt: Sequelize.DATE,
  });

  User.prototype.verifyPassword = async function verifyPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) reject(err);
        else resolve(isMatch);
      });
    });
  };

  User.hashPassword = async password => {
    if (password) {
      return new Promise(((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          if (err) return reject(err);
          // Hash the password using our new salt
          bcrypt.hash(password, salt, (hashError, hash) => {
            if (hashError) return reject(hashError);
            // Override the cleartext password with the hashed one
            password = hash;
            resolve(password);
          });
        });
      }));
    }
    return Promise.resolve();
  };

  User.register = async (username, password) => {
    username = username && username.toLowerCase();
    password = await User.hashPassword(password);
    const user = await User.findOne({ where: { username } });
    if (user) return null;
    return User.create({ username, password });
  };

  User.login = async (username, password) => {
    username = username && username.toLowerCase();
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    const isValid = await user.verifyPassword(password);
    if (!isValid) return null;
    return user;
  };

  return User;
};
