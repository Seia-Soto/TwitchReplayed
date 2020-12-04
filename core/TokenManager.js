const { twitch } = require('twitchd/structures')
const EventEmitter = require('events')

module.exports = class TokenManager {
  constructor (opts = {}) {
    this.checkInterval = opts.checkInterval || 5 * 1000

    this.event = new EventEmitter()
    this.opts = opts

    this.busy = 0
    this.token = 0

    this.getPrivateToken()
      .then(() => {
        setInterval(async () => {
          if (this.busy) {
            return
          }
          if (await this.checkIfExpired()) {
            this.refreshPrivateToken()
          }
        }, this.checkInterval)
      })
  }

  async getPrivateToken () {
    this.busy = 1

    const { clientID } = await twitch.getPrivateToken()

    this.token = clientID
    this.busy = 0

    this.event.emit('token.update')

    return clientID
  }

  async checkIfExpired () {
    const data = await twitch.getAccessToken({
      clientID: this.token,
      username: 'fluentAroma'
    })

    return (!data.token || !data.sig)
  }

  refreshPrivateToken () {
    return this.getPrivateToken
  }
}
