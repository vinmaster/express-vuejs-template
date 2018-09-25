const Helper = require(`${process.cwd()}/src/server/lib/helper`);
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: {
      type: Sequelize.VIRTUAL,
    },
    passwordHash: Sequelize.TEXT,
    refreshToken: Sequelize.STRING,
    lastLoginAt: Sequelize.DATE,
  });

  User.prototype.verifyPassword = async function verifyPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.passwordHash, (err, isMatch) => {
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

  User.hook('beforeSave', async (user, _options) => {
    if (user.password) {
      user.passwordHash = await User.hashPassword(user.password);
    }
    if (!user.refreshToken) {
      const refreshToken = Helper.generateHex(16);
      user.refreshToken = refreshToken;
    }
  });

  return User;
};
