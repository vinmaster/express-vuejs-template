const Logger = require(process.cwd() + '/src/server/lib/logger')

class Util {
  // Success JSON
  static renderJson(res, response, meta = null) {
    return res.json({
      status: 200,
      response: response,
      meta: meta,
      error: null
    })
  }

  static renderBadJson(res, message) {
    Util.renderErrorJson(res, Util.createError(message))
  }

  static renderErrorJson(res, err) {
    if (!(err instanceof Error)) { err = Util.createError(err, 500) }

    const status = err.status || 500
    if (status === 404) {
      // Don't show stack to public
      err.stack = undefined
    } else {
      Logger.error(err)
    }

    return res.status(status).json({
      status: status,
      response: null,
      meta: null,
      error: {
        message: err.message,
        info: err,
        stack: err.stack
      }
    })
  }

  // Function for creating Error object
  static createError(message, status = 400) {
    const err = new Error(message)
    err.status = status
    return err
  }
}

module.exports = Util
