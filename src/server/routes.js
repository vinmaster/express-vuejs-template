const express = require('express')
const router = express.Router()
const apiRoutes = express.Router()
const Application = require(process.cwd() + '/src/server/controllers/application')
const Calendars = require(process.cwd() + '/src/server/controllers/calendars')
const Util = require(process.cwd() + '/src/server/lib/util')

// TODO DELETE
// router.get('/error', application.error);
// router.get('/test', application.test);

// Render home page
const homeRoutes = ['/', '/todos', '/calendars']
router.get(homeRoutes, Application.index)

router.use('/api', apiRoutes)
apiRoutes.get('/calendars', Calendars.index)

// Unmatched routes
router.use((req, res, next) => {
  // Send to error
  next(Util.createError('Not Found', 404))
})

// Matching errors
router.use((err, req, res, next) => {
  Util.renderErrorJson(res, err)
})

module.exports = router
