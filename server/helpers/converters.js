const acho = require('acho')

// reader({ filepath: '~/HOME', filename: 'test.txt', permissions: '644' })
const reader = function (opts) {
  const { filepath, filename, permissions } = opts
  acho.info(`Reading file ${filename} at ${filepath} with ${permissions}`)
}

module.exports = {
  reader
}
