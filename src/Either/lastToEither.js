/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Either = require('.')
const Last = require('../core/types').proxy('Last')

const curry = require('../core/curry')
const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = (left, last) =>
  last.value().either(
    constant(Either.Left(left)),
    Either.Right
  )

// lastToEither : c -> Last a -> Either c a
// lastToEither : c -> (a -> Last b) -> a -> Either c b
function lastToEither(left, last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToEither: Last returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(left, last)
  }

  throw new TypeError('lastToEither: Last or Last returing function required for second argument')
}

module.exports = curry(lastToEither)
