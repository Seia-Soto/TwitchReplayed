const {
  TokenManager,
  User,
  Workspace
} = require('./core')

module.exports = class Client {
  constructor (opts = {}) {
    this.opts = opts

    this.users = []

    this.Workspace = new Workspace()
    this.TokenManager = new TokenManager()
  }

  registerUsers (users) {
    if (!users || !users.length) {
      throw new Error('The user to make history was not found!')
    }

    for (let i = 0, l = users.length; i < l; i++) {
      this.users.push(new User({ username: users[i], client: this, opts: this.opts }))
    }
  }

  initialize () {
    this.DataManager.createDirectory()
  }
}
