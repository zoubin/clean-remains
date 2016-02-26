'use strict'

const stream = require('stream')
const del = require('del')
const globby = require('globby')
const path = require('path')

function clean(stalePaths) {
  if (!Array.isArray(stalePaths)) {
    return stream.PassThrough({ objectMode: true })
  }

  let files = []

  function write(file, enc, next) {
    if (file.path) {
      files.push(file)
    }
    next(null, file)
  }

  function end(next) {
    let valid = new Set()
    for (let file of files) {
      valid.add(file.path)
    }

    let toDelete = []
    for (let file of stalePaths) {
      if (!valid.has(file)) {
        toDelete.push(file)
      }
    }

    stalePaths.length = 0
    for (let file of valid) {
      stalePaths.push(file)
    }

    this.emit('delete', toDelete)

    if (!toDelete.length) return next()

    del(toDelete).then(() => next(), () => next())
  }

  return stream.Transform({
    objectMode: true,
    transform: write,
    flush: end,
  })
}

module.exports = function (stalePaths) {
  return clean.bind(null, stalePaths)
}
module.exports.glob = function (patterns, opts) {
  opts = Object.assign({ cwd: process.cwd() }, opts)
  let stalePaths = globby.sync(patterns, opts)
    .map(f => path.resolve(opts.cwd, f))
  return clean.bind(null, stalePaths)
}

