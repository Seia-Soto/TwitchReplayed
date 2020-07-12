module.exports = class StreamManager {
  constructor (opts = {}) {
    if (opts.username) {
      throw new Error('StreamManager.constructor: The username of streamer should be provided!')
    }

    this.opts = opts
  }
}
