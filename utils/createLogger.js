const debug = require('debug')

const pkg = require('../package')

module.exports = (name = '') => {
  const subseq = name.length
    ? ':' + name
    : ''

  return debug(pkg.name + subseq)
}
