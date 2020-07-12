const {
  DataManager,
  StreamManager,
  TokenManager
} = require('./core')

module.exports = class Client {
  constructor (opts = {}) {
    this.opts = opts

    this.users = []

    this.DataManager = new DataManager()
    this.TokenManager = new TokenManager()
  }

  registerUsers (users) {
    if (!users || !users.length) {
      throw new Error('The user to make history was not found!')
    }

    for (let i = 0, l = users.length; i < l; i++) {
      this.users.push(new StreamManager({ username: users[i], client: this, opts: this.opts }))
    }
  }

  initialize () {
    this.DataManager.createDirectory()
  }
}
