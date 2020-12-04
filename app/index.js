const Client = require('../')
const config = require('./config')

const app = new Client(config.opts)

app.registerUsers(config.users)
