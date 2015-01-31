// Adapted from:
//
// jQuery throttle / debounce - v1.1 - 3/7/2010
// http://benalman.com/projects/jquery-throttle-debounce-plugin/
//
// Copyright (c) 2010 "Cowboy" Ben Alman
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/


'use strict'


var throttle = require('./throttle');

// Arguments: (<delay> [, <at_begin>], <callback>)
//
//  delay - (Number) A zero-or-greater delay in milliseconds. For event
//    callbacks, values around 100 or 250 (or even higher) are most useful.
//
//  at_begin - (Boolean) Optional, defaults to false. If at_begin is false or
//    unspecified, callback will only be executed `delay` milliseconds after
//    the last debounced-function call. If at_begin is true, callback will be
//    executed only at the first debounced-function call. (After the
//    throttled-function has not been called for `delay` milliseconds, the
//    internal counter is reset)
//
//  callback - (Function) A function to be executed after delay milliseconds.
//    The `this` context and all arguments are passed through, as-is, to
//    `callback` when the debounced-function is executed.
//
// Returns:
//
//  (Function) A new, debounced, function.

module.exports = function (delay, at_begin, callback) {
  return callback === undefined
    ? throttle(delay, at_begin, false)
    : throttle(delay, callback, at_begin !== false)
}
