const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

// PORT = '3003'
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})