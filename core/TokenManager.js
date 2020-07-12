const { twitch } = require('twitchd/structures')

module.exports = class TokenManager {
  constructor (opts = {}) {
    opts.checkInterval = opts.checkInterval || 5 * 1000

    this.opts = opts

    this.busy = 0
    this.token = 0

    this.getPrivateToken()
      .then(() => {
        setTimeout(async () => {
          if (this.busy) {
            return
          }
          if (await this.checkIfExpired()) {
            this.refreshPrivateToken()
          }
        }, opts.checkInterval)
      })
  }

  async getPrivateToken () {
    this.busy = 1

    const token = await twitch.getPrivateToken()

    this.token = token
    this.busy = 0

    return token
  }

  async checkIfExpired () {
    const data = await twitch.getAccesstoken({
      clientID: this.token,
      username: 'fluentAroma'
    })

    return (!data.token || !data.sig)
  }

  refreshPrivateToken () {
    return this.getPrivateToken
  }
}
