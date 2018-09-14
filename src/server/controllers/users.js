const Helper = require(`${process.cwd()}/src/server/lib/helper`);
const Models = require(`${process.cwd()}/src/server/models/index`);
const { User } = Models;

module.exports = class UsersController {
  static async register(req, res, _next) {
    const { username, password, passwordConfirmation } = req.body;
    Helper.verifyParamsBang(req.body, 'username', 'password', 'passwordConfirmation');
    if (password !== passwordConfirmation) {
      throw Helper.createError('Password confirmation does not match');
    }
    const user = await User.register(username, password);
    if (!user) {
      throw Helper.createError('Error registering');
    }
    const token = Helper.jwtSign({ userId: user.id });
    Helper.renderSuccessJson(res, { token, username });
  }

  static async login(req, res, _next) {
    const { username, password } = req.body;
    Helper.verifyParamsBang(req.body, 'username', 'password');
    let user = await User.login(username, password);
    if (!user) {
      throw Helper.createError('Error logging In');
    }
    user.lastLoginAt = new Date();
    user = await user.save();
    const token = Helper.jwtSign({ userId: user.id });
    Helper.renderSuccessJson(res, { token, username });
  }

  static logout(req, res, _next) {
    Helper.renderSuccessJson(res, 'Logging out');
  }
};
