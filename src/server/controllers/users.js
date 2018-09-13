const Helper = require(`${process.cwd()}/src/server/lib/helper`);

const calendars = [
  {
    id: '1',
    name: 'Test Calendar 1',
    events: [
      { start: new Date(), end: new Date() },
    ],
  },
  {
    id: '2',
    name: 'Test Calendar 2',
    events: [
      { start: new Date(), end: new Date() },
    ],
  },
];

module.exports = class UsersController {
  static index(req, res, _next) {
    Helper.renderSuccessJson(res, { calendars });
  }
};
