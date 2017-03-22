const Util = require(process.cwd() + '/src/server/lib/util')

const calendars = [
  {
    id: '1',
    name: 'Test Calendar 1',
    events: [
      { start: new Date(), end: new Date() }
    ]
  },
  {
    id: '2',
    name: 'Test Calendar 2',
    events: [
      { start: new Date(), end: new Date() }
    ]
  },
]

module.exports = class Application {
  static index(req, res, next) {
    Util.renderJson(res, { calendars })
  }
}
