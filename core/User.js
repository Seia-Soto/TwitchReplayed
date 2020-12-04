const { twitch } = require('twitchd/structures')
const EventEmitter = require('events')

const { createLogger } = require('../utils')

module.exports = class User {
  constructor (opts = {}) {
    if (!opts.username) {
      throw new Error('User.constructor: The username of streamer should be provided!')
    }

    this.client = opts.client
    this.event = new EventEmitter()
    this.workspacePath = this.client.Workspace.createWorkspace(opts.username)
    this.debug = createLogger('user.' + opts.username)

    this.opts = opts.user
    this.username = opts.username
    this.updateInterval = opts.opts.updateInterval
    this.isBusy = 0

    this.client.TokenManager.event.once('token.update', () => {
      this.debug('TokenManager updated token and user metadata will be updated soon')

      this.update()
    })
  }

  async update () {
    if (this.isBusy) {
      return
    }

    this.isBusy = 1

    this.debug('updating user metadata')

    const data = await twitch.getChannelStatus({
      clientID: this.client.TokenManager.token,
      username: this.username
    })

    if (!data.user) {
      return this.debug('failed to update user object as there was no returned data')
    }

    const { user } = data

    this.user = this.user || {}
    this.user.id = user.id || this.user.id
    this.user.username = user.login || this.user.username
    this.user.displayName = user.displayName || this.user.displayName
    this.user.description = user.description || this.user.description
    this.user.createdAt = user.createdAt || this.user.createdAt
    this.user.offlineImageURL = user.offlineImageURL || this.user.offlineImageURL
    this.user.profileImageURL = user.profileImageURL || this.user.profileImageURL
    this.user.profileViewCount = user.profileViewCount || this.user.profileViewCount
    this.user.hasPrime = user.hasPrime
    this.user.hasTurbo = user.hasTurbo
    this.user.updatedAt = user.updatedAt
    this.user.isParter = user.roles.isParter
    this.user.isStreaming = Boolean(this.user.stream)
    this.user.stream = {
      id: user.stream.id,
      title: user.stream.title,
      type: user.stream.type,
      viewersCount: user.stream.viewersCount,
      createdAt: user.stream.createdAt,
      averageFPS: user.stream.averageFPS,
      bitrate: user.stream.bitrate,
      broadcastSoftware: user.stream.broadcastSoftware,
      codec: user.stream.codec,
      height: user.stream.height,
      width: user.stream.width,
      clipCount: user.stream.clipCount,
      previewImageURL: user.stream.previewImageURL,
      isParter: user.stream.isPartner,
      isStreamDropsEnabled: user.stream.isStreamDropsEnabled,
      game: {
        name: user.stream.game.name
      }
    }

    console.log(this.user)

    this.event.emit('user.update', this.user)

    this.isBusy = 0

    if (this.updateInterval) {
      setInterval(() => {
        if (!this.isBusy) this.update()
      }, this.updateInterval)
    }
  }
}
