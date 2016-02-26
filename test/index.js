'use strict'

const test = require('tap').test
const clean = require('..')

test('add', function (t) {
  let paths = ['/a']
  let s = clean(paths)()
  s.once('delete', function (deleted) {
    t.same(deleted, [])
    t.same(paths, ['/a', '/b'])
    s = clean(paths)()
    s.once('delete', function (d) {
      t.same(d, [])
      t.same(paths, ['/a', '/b', '/c'])
      t.end()
    })
    s.write({ path: '/a' })
    s.write({ path: '/b' })
    s.write({ path: '/c' })
    s.end()
  })
  s.write({ path: '/a' })
  s.write({ path: '/b' })
  s.end()
})

test('delete', function (t) {
  let paths = ['/a', '/b', '/c']
  let s = clean(paths)()
  s.once('delete', function (deleted) {
    t.same(deleted, ['/c'])
    t.same(paths, ['/a', '/b'])
    s = clean(paths)()
    s.once('delete', function (d) {
      t.same(d, ['/b'])
      t.same(paths, ['/a'])
      t.end()
    })
    s.write({ path: '/a' })
    s.end()
  })
  s.write({ path: '/a' })
  s.write({ path: '/b' })
  s.end()
})

