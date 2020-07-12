const { twitch } = require('twitchd/structures')
const EventEmitter = require('events')

module.exports = class StreamManager {
  constructor (opts = {}) {
    if (opts.username) {
      throw new Error('StreamManager.constructor: The username of streamer should be provided!')
    }

    this.opts = opts.user
    this.username = opts.username
    this.client = opts.client
    this.event = new EventEmitter()

    this.updateInterval = this.opts.updateInterval

    this.workspacePath = this.client.DataManager.createWorkspace(this.username)

    this.updateUser(this.updateInterval)
  }

  async updateUser (interval) {
    let isBusy = 0

    const updateUser = () => {
      isBusy = 1

      twitch.getChannelStatus()
        .then(data => {
          if (!data.user) {
            throw new Error('StreamManager.updateUser: This user seems does not exist on Twitch network!')
          }

          const { user } = data

          this.user = {}
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
          this.user.activity = this.user.activity.type || user.activity.type
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

          this.event.emit('user.update', this.user)

          isBusy = 0
        })
    }

    updateUser()

    if (interval) {
      setInterval(() => {
        if (!isBusy) {
          updateUser()
        }
      }, interval)
    }
  }
}
