const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

module.exports = class DataManager {
  constructor (opts = {}) {
    opts.directoryName = opts.directoryName || '.data'

    this.opts = opts
  }

  getDirectoryPath () {
    return path.join(process.cwd(), this.opts.directoryName)
  }

  createDirectory () {
    const directoryPath = this.getDirectoryPath()

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }

    return directoryPath
  }

  getWorkspaces () {
    const directoryPath = this.getDirectoryPath()

    this.createDirectory()

    const items = fs.readdirSync(directoryPath)
    const workspaces = []

    for (let i = 0, l = items.length; i < l; i++) {
      if (!fs.lstatSync(path.join(directoryPath, items[i])).isDirectory()) {
        continue
      }

      workspaces.push(items[i])
    }

    return workspaces
  }

  createWorkspace (name = uuid.v1()) {
    const directoryPath = this.getDirectoryPath()
    const workspacePath = path.join(directoryPath, name)

    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true })
    }

    return workspacePath
  }

  removeWorkspace (name) {
    if (!name) {
      throw new Error('DataManager.removeWorkspace: The name of workspace to remove should be provided!')
    }

    const directoryPath = this.getDirectoryPath()
    const workspaces = this.getWorkspaces()

    if (workspaces.indexOf(name) === -1) {
      throw new Error('DataManager.removeWorkspace: The name of workspace to remove does not exists!')
    }

    fs.rmdirSync(path.join(directoryPath, name), { recursive: true })
  }
}
