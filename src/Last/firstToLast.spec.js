const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const First = require('../First')
const Last = require('.')

const identity = require('../core/identity')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const firstToLast = require('./firstToLast')

test('firstToLast transform', t => {
  const f = bindFunc(firstToLast)

  t.ok(isFunction(firstToLast), 'is a function')

  const err = /firstToLast: First or First returing function required/
  t.throws(f(undefined), err, 'throws if arg is undefined')
  t.throws(f(null), err, 'throws if arg is null')
  t.throws(f(0), err, 'throws if arg is a falsey number')
  t.throws(f(1), err, 'throws if arg is a truthy number')
  t.throws(f(''), err, 'throws if arg is a falsey string')
  t.throws(f('string'), err, 'throws if arg is a truthy string')
  t.throws(f(false), err, 'throws if arg is false')
  t.throws(f(true), err, 'throws if arg is true')
  t.throws(f([]), err, 'throws if arg is an array')
  t.throws(f({}), err, 'throws if arg is an object')

  t.end()
})

test('firstToLast with First', t => {
  const some = 'first'
  const none = 'empty'

  const good = firstToLast(First(some))
  const bad = firstToLast(First.empty())

  t.ok(isSameType(Last, good), 'returns a Last when First')
  t.ok(isSameType(Last, bad), 'returns a Last when Empty')

  t.equals(good.option(none), some, 'First maps to a Just')
  t.equals(bad.option(none), none, 'Empty maps to a Nothing')

  t.end()
})

test('firstToLast with First returning function', t => {
  const some = 'first'
  const none = 'empty'

  t.ok(isFunction(firstToLast(Last)), 'returns a function')

  const f = bindFunc(firstToLast(identity))

  const err = /firstToLast: First returing function required/
  t.throws(f(undefined), err, 'throws if function returns undefined')
  t.throws(f(null), err, 'throws if function returns null')
  t.throws(f(0), err, 'throws if function returns a falsey number')
  t.throws(f(1), err, 'throws if function returns a truthy number')
  t.throws(f(''), err, 'throws if function returns a falsey string')
  t.throws(f('string'), err, 'throws if function returns a truthy string')
  t.throws(f(false), err, 'throws if function returns false')
  t.throws(f(true), err, 'throws if function returns true')
  t.throws(f([]), err, 'throws if function returns an array')
  t.throws(f({}), err, 'throws if function returns an object')

  const lift =
    x => x !== undefined ? First(x) : First.empty()

  const good = firstToLast(lift, some)
  const bad = firstToLast(lift, undefined)

  t.ok(isSameType(Last, good), 'returns a Last with a First')
  t.ok(isSameType(Last, bad), 'returns a Last with an Empty')

  t.equals(good.option(none), some, 'First maps to a Just')
  t.equals(bad.option(none), none, 'Empty maps to a Nothing')

  t.end()
})
