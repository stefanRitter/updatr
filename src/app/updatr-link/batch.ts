

import { EventEmitter } from './eventemitter'

/**
 * Noop.
 */

function noop(){}


/**
 * Create a new Batch.
 */

export function Batch() {
  this.fns = [];
  this.concurrency(Infinity);
  this.throws(true);
  for (var i = 0, len = arguments.length; i < len; ++i) {
    this.push(arguments[i]);
  }
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Batch.prototype.__proto__ = EventEmitter.prototype;


/**
 * Set concurrency to `n`.
 *
 * @param {Number} n
 * @return {Batch}
 * @api public
 */

Batch.prototype.concurrency = function(n){
  this.n = n;
  return this;
};

/**
 * Queue a function.
 *
 * @param {Function} fn
 * @return {Batch}
 * @api public
 */

Batch.prototype.push = function(fn){
  this.fns.push(fn);
  return this;
};

/**
 * Set wether Batch will or will not throw up.
 *
 * @param  {Boolean} throws
 * @return {Batch}
 * @api public
 */
Batch.prototype.throws = function(throws) {
  this.e = !!throws;
  return this;
};

/**
 * Execute all queued functions in parallel,
 * executing `cb(err, results)`.
 *
 * @param {Function} cb
 * @return {Batch}
 * @api public
 */

Batch.prototype.end = function(cb){
  var self = this
    , total = this.fns.length
    , pending = total
    , results = []
    , errors = []
    , cb = cb || noop
    , fns = this.fns
    , max = this.n
    , throws = this.e
    , index = 0
    , done;

  // empty
  if (!fns.length) return cb(null, results);

  // process
  function next() {
    var i = index++;
    var fn = fns[i];
    if (!fn) return;
    var start = new Date;

    try {
      fn(callback);
    } catch (err) {
      callback(err, null);
    }

    function callback(err, res){
      if (done) return;
      if (err && throws) return done = true, cb(err);
      var complete = total - pending + 1;
      var end = new Date;

      results[i] = res;
      errors[i] = err;

      self.emit('progress', {
        index: i,
        value: res,
        error: err,
        pending: pending,
        total: total,
        complete: complete,
        percent: complete / total * 100 | 0,
        start: start,
        end: end,
        duration: <any>end - <any>start
      });

      if (--pending) next();
      else if(!throws) cb(errors, results);
      else cb(null, results);
    }
  }

  // concurrency
  for (var i = 0; i < fns.length; i++) {
    if (i == max) break;
    next();
  }

  return this;
};
