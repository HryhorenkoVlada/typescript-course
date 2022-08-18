// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/seedrandom/lib/alea.js":[function(require,module,exports) {
var define;
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],"node_modules/seedrandom/lib/xor128.js":[function(require,module,exports) {
var define;
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],"node_modules/seedrandom/lib/xorwow.js":[function(require,module,exports) {
var define;
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],"node_modules/seedrandom/lib/xorshift7.js":[function(require,module,exports) {
var define;
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],"node_modules/seedrandom/lib/xor4096.js":[function(require,module,exports) {
var define;
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],"node_modules/seedrandom/lib/tychei.js":[function(require,module,exports) {
var define;
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],"../../../../.nvm/versions/node/v14.16.0/lib/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/seedrandom/seedrandom.js":[function(require,module,exports) {
var global = arguments[3];
var define;
/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
} else {
  // When included as a plain script, set up Math.seedrandom global.
  math['seed' + rngname] = seedrandom;
}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":"../../../../.nvm/versions/node/v14.16.0/lib/node_modules/parcel-bundler/src/builtins/_empty.js"}],"node_modules/seedrandom/index.js":[function(require,module,exports) {
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":"node_modules/seedrandom/lib/alea.js","./lib/xor128":"node_modules/seedrandom/lib/xor128.js","./lib/xorwow":"node_modules/seedrandom/lib/xorwow.js","./lib/xorshift7":"node_modules/seedrandom/lib/xorshift7.js","./lib/xor4096":"node_modules/seedrandom/lib/xor4096.js","./lib/tychei":"node_modules/seedrandom/lib/tychei.js","./seedrandom":"node_modules/seedrandom/seedrandom.js"}],"node_modules/uuid/dist/esm-browser/rng.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
},{}],"node_modules/uuid/dist/esm-browser/regex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/validate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(require("./regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;
},{"./regex.js":"node_modules/uuid/dist/esm-browser/regex.js"}],"node_modules/uuid/dist/esm-browser/stringify.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0; // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434

  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;
},{"./validate.js":"node_modules/uuid/dist/esm-browser/validate.js"}],"node_modules/uuid/dist/esm-browser/v1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports.default = _default;
},{"./rng.js":"node_modules/uuid/dist/esm-browser/rng.js","./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js"}],"node_modules/uuid/dist/esm-browser/parse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;
},{"./validate.js":"node_modules/uuid/dist/esm-browser/validate.js"}],"node_modules/uuid/dist/esm-browser/v35.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URL = exports.DNS = void 0;
exports.default = _default;

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js","./parse.js":"node_modules/uuid/dist/esm-browser/parse.js"}],"node_modules/uuid/dist/esm-browser/md5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./v35.js":"node_modules/uuid/dist/esm-browser/v35.js","./md5.js":"node_modules/uuid/dist/esm-browser/md5.js"}],"node_modules/uuid/dist/esm-browser/v4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  var rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;
},{"./rng.js":"node_modules/uuid/dist/esm-browser/rng.js","./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js"}],"node_modules/uuid/dist/esm-browser/sha1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./v35.js":"node_modules/uuid/dist/esm-browser/v35.js","./sha1.js":"node_modules/uuid/dist/esm-browser/sha1.js"}],"node_modules/uuid/dist/esm-browser/nil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports.default = _default;
},{"./validate.js":"node_modules/uuid/dist/esm-browser/validate.js"}],"node_modules/uuid/dist/esm-browser/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

var _nil = _interopRequireDefault(require("./nil.js"));

var _version = _interopRequireDefault(require("./version.js"));

var _validate = _interopRequireDefault(require("./validate.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./v1.js":"node_modules/uuid/dist/esm-browser/v1.js","./v3.js":"node_modules/uuid/dist/esm-browser/v3.js","./v4.js":"node_modules/uuid/dist/esm-browser/v4.js","./v5.js":"node_modules/uuid/dist/esm-browser/v5.js","./nil.js":"node_modules/uuid/dist/esm-browser/nil.js","./version.js":"node_modules/uuid/dist/esm-browser/version.js","./validate.js":"node_modules/uuid/dist/esm-browser/validate.js","./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js","./parse.js":"node_modules/uuid/dist/esm-browser/parse.js"}],"node_modules/@ngneat/falso/index.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementalDate = incrementalDate;
exports.incrementalNumber = incrementalNumber;
exports.rand = rand;
exports.randAbbreviation = randAbbreviation;
exports.randAccessory = randAccessory;
exports.randAccount = randAccount;
exports.randAddress = randAddress;
exports.randAirline = randAirline;
exports.randAirport = randAirport;
exports.randAirportCode = randAirportCode;
exports.randAirportName = randAirportName;
exports.randAlpha = randAlpha;
exports.randAlphaNumeric = randAlphaNumeric;
exports.randAmericanFootballTeam = randAmericanFootballTeam;
exports.randAmount = randAmount;
exports.randAnimalType = randAnimalType;
exports.randArn = randArn;
exports.randAvatar = randAvatar;
exports.randAwsRegion = randAwsRegion;
exports.randAwsRequestId = randAwsRequestId;
exports.randAwsService = randAwsService;
exports.randBaseballTeam = randBaseballTeam;
exports.randBasketballTeam = randBasketballTeam;
exports.randBear = randBear;
exports.randBetweenDate = randBetweenDate;
exports.randBic = randBic;
exports.randBinary = randBinary;
exports.randBird = randBird;
exports.randBitcoinAddress = randBitcoinAddress;
exports.randBook = randBook;
exports.randBoolean = randBoolean;
exports.randBrand = randBrand;
exports.randBrowser = randBrowser;
exports.randCardinalDirection = randCardinalDirection;
exports.randCat = randCat;
exports.randCatchPhrase = randCatchPhrase;
exports.randCetacean = randCetacean;
exports.randCity = randCity;
exports.randClothingSize = randClothingSize;
exports.randCodeSnippet = randCodeSnippet;
exports.randColor = randColor;
exports.randCompanyName = randCompanyName;
exports.randCountry = randCountry;
exports.randCountryCode = randCountryCode;
exports.randCounty = randCounty;
exports.randCow = randCow;
exports.randCreditCard = randCreditCard;
exports.randCreditCardBrand = randCreditCardBrand;
exports.randCreditCardCVV = randCreditCardCVV;
exports.randCreditCardNumber = randCreditCardNumber;
exports.randCrocodilia = randCrocodilia;
exports.randCurrencyCode = randCurrencyCode;
exports.randCurrencyName = randCurrencyName;
exports.randCurrencySymbol = randCurrencySymbol;
exports.randDatabaseCollation = randDatabaseCollation;
exports.randDatabaseColumn = randDatabaseColumn;
exports.randDatabaseEngine = randDatabaseEngine;
exports.randDatabaseType = randDatabaseType;
exports.randDepartment = randDepartment;
exports.randDirection = randDirection;
exports.randDirectoryPath = randDirectoryPath;
exports.randDog = randDog;
exports.randDomainName = randDomainName;
exports.randDomainSuffix = randDomainSuffix;
exports.randDrinks = randDrinks;
exports.randEmail = randEmail;
exports.randEmailProvider = randEmailProvider;
exports.randEmoji = randEmoji;
exports.randEthereumAddress = randEthereumAddress;
exports.randFileExt = randFileExt;
exports.randFileName = randFileName;
exports.randFilePath = randFilePath;
exports.randFileType = randFileType;
exports.randFirstName = randFirstName;
exports.randFish = randFish;
exports.randFlightDetails = randFlightDetails;
exports.randFlightNumber = randFlightNumber;
exports.randFloat = randFloat;
exports.randFontFamily = randFontFamily;
exports.randFontSize = randFontSize;
exports.randFood = randFood;
exports.randFootballTeam = randFootballTeam;
exports.randFrequency = randFrequency;
exports.randFullAddress = randFullAddress;
exports.randFullName = randFullName;
exports.randFutureDate = randFutureDate;
exports.randGender = randGender;
exports.randGitBranch = randGitBranch;
exports.randGitCommitEntry = randGitCommitEntry;
exports.randGitCommitMessage = randGitCommitMessage;
exports.randGitCommitSha = randGitCommitSha;
exports.randGitShortSha = randGitShortSha;
exports.randHex = randHex;
exports.randHexaDecimal = randHexaDecimal;
exports.randHorse = randHorse;
exports.randHsl = randHsl;
exports.randHttpMethod = randHttpMethod;
exports.randIban = randIban;
exports.randIceHockeyTeam = randIceHockeyTeam;
exports.randImg = randImg;
exports.randIntegration = randIntegration;
exports.randIp = randIp;
exports.randIpv6 = randIpv6;
exports.randJSON = randJSON;
exports.randJobArea = randJobArea;
exports.randJobDescriptor = randJobDescriptor;
exports.randJobTitle = randJobTitle;
exports.randJobType = randJobType;
exports.randLanguage = randLanguage;
exports.randLastName = randLastName;
exports.randLatitude = randLatitude;
exports.randLine = randLine;
exports.randLines = randLines;
exports.randLion = randLion;
exports.randLocale = randLocale;
exports.randLongitude = randLongitude;
exports.randMac = randMac;
exports.randMask = randMask;
exports.randMimeType = randMimeType;
exports.randMonth = randMonth;
exports.randMovie = randMovie;
exports.randMovieCharacter = randMovieCharacter;
exports.randMusicGenre = randMusicGenre;
exports.randNearbyGPSCoordinate = randNearbyGPSCoordinate;
exports.randNumber = randNumber;
exports.randOAuthProvider = randOAuthProvider;
exports.randOctal = randOctal;
exports.randOrdinalDirection = randOrdinalDirection;
exports.randParagraph = randParagraph;
exports.randPassword = randPassword;
exports.randPastDate = randPastDate;
exports.randPermission = randPermission;
exports.randPersonTitle = randPersonTitle;
exports.randPhoneNumber = randPhoneNumber;
exports.randPhrase = randPhrase;
exports.randPort = randPort;
exports.randPost = randPost;
exports.randPriority = randPriority;
exports.randProduct = randProduct;
exports.randProductAdjective = randProductAdjective;
exports.randProductCategory = randProductCategory;
exports.randProductDescription = randProductDescription;
exports.randProductMaterial = randProductMaterial;
exports.randProductName = randProductName;
exports.randProgrammingLanguage = randProgrammingLanguage;
exports.randPronoun = randPronoun;
exports.randProtocol = randProtocol;
exports.randQuote = randQuote;
exports.randRabbit = randRabbit;
exports.randRecentDate = randRecentDate;
exports.randRgb = randRgb;
exports.randRole = randRole;
exports.randRoutingNumber = randRoutingNumber;
exports.randSeatNumber = randSeatNumber;
exports.randSemver = randSemver;
exports.randSentence = randSentence;
exports.randSequence = randSequence;
exports.randShape = randShape;
exports.randSinger = randSinger;
exports.randSkill = randSkill;
exports.randSlug = randSlug;
exports.randSnake = randSnake;
exports.randSocial = randSocial;
exports.randSong = randSong;
exports.randSoonDate = randSoonDate;
exports.randSports = randSports;
exports.randSportsTeam = randSportsTeam;
exports.randState = randState;
exports.randStateAbbr = randStateAbbr;
exports.randStatus = randStatus;
exports.randStreetAddress = randStreetAddress;
exports.randStreetName = randStreetName;
exports.randSubscriptionPlan = randSubscriptionPlan;
exports.randSuperhero = randSuperhero;
exports.randSuperheroName = randSuperheroName;
exports.randSvg = randSvg;
exports.randSwift = randSwift;
exports.randText = randText;
exports.randTextRange = randTextRange;
exports.randTimeZone = randTimeZone;
exports.randTodo = randTodo;
exports.randTransactionType = randTransactionType;
exports.randUrl = randUrl;
exports.randUser = randUser;
exports.randUserAgent = randUserAgent;
exports.randUserName = randUserName;
exports.randUuid = randUuid;
exports.randVehicle = randVehicle;
exports.randVehicleFuel = randVehicleFuel;
exports.randVehicleManufacturer = randVehicleManufacturer;
exports.randVehicleModel = randVehicleModel;
exports.randVehicleType = randVehicleType;
exports.randVerb = randVerb;
exports.randWeekday = randWeekday;
exports.randWord = randWord;
exports.randZipCode = randZipCode;
exports.random = random;
exports.seed = seed;

var _seedrandom = _interopRequireDefault(require("seedrandom"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let prng = (0, _seedrandom.default)();
/**
 * Create a seed.
 *
 * @category general
 *
 * @example
 *
 * random()
 *
 */

function random() {
  return prng();
}
/**
 * Sets and Resets random seed.
 *
 * @category general
 *
 * @example
 *
 * seed()
 *
 * @example
 *
 * seed('some-constant-seed')
 */


function seed(value) {
  prng = (0, _seedrandom.default)(value);
}

function fake(data, options) {
  const dataSource = Array.isArray(data) ? () => randElement(data) : data;

  if ((options == null ? void 0 : options.length) === undefined) {
    return dataSource(0);
  }

  return Array.from({
    length: options.length
  }, (_, index) => dataSource(index));
}

function randElement(arr) {
  return arr[Math.floor(random() * arr.length)];
}

function getRandomInRange({
  min = 1.0,
  max = 9999.99,
  fraction = 0
} = {}) {
  return Number((random() * (max - min) + min).toFixed(fraction));
}

var data$1X = ["SCSI", "SMTP", "ADP", "TCP", "PNG", "EXE", "AI", "RAM", "RSS", "GB", "SSL", "CSS", "SAS", "SDD", "PCI", "IB", "SQL", "XML", "THX", "AGP", "HTTP", "SMS", "FTP", "JBOD", "XSS", "HDD", "JSON", "COM"];
/**
 * Generate a random abbreviation.
 *
 * @category text
 *
 * @example
 *
 * randAbbreviation()
 *
 * @example
 *
 * randAbbreviation({ length: 10 })
 *
 */

function randAbbreviation(options) {
  return fake(data$1X, options);
}

var data$1W = ["Sunglasses", "Apron", "Necklace", "Watch", "Socks", "Tie", "Bow tie", "Purse", "Ring", "Gloves", "Scarf", "Umbrella", "Boots", "Mittens", "Stockings", "Earmuffs", "Hair clip", "Bobby pin", "Hair band", "Safety pin", "Pocket watch", "Beanie", "Cap", "Beret", "Straw hat", "Derby hat", "Helmet", "Top hat", "Mortar board"];
/**
 * Generate a random accessory.
 *
 * @category Commerce
 *
 * @example
 *
 * randAccessory()
 *
 * @example
 *
 * randAccessory({ length: 10 })
 *
 */

function randAccessory(options) {
  return fake(data$1W, options);
}
/**
 * Generate a random account.
 *
 * @category finance
 *
 * @example
 *
 * randAccount()
 *
 * @example
 *
 * randAccount({ accountLength: 12 }) // default is 9
 *
 * @example
 *
 * randAccount({ length: 10 })
 *
 */


function randAccount(options) {
  var _options$accountLengt;

  const accountLength = (_options$accountLengt = options == null ? void 0 : options.accountLength) != null ? _options$accountLengt : 9;

  const factory = () => {
    return Array(accountLength).fill('#').join('').replace(/#/g, () => {
      return getRandomInRange({
        min: 0,
        max: 9
      }).toString();
    });
  };

  return fake(factory, options);
}

const numericChars = '0123456789';
const alphaChars = 'abcdefghijklmnopqrstuvwxyz'; // TODO

const numericAlphaChars = `${numericChars}${alphaChars}${alphaChars.toUpperCase()}`;

function generator$1(size = 8, chars = numericAlphaChars) {
  let result = '';

  for (let i = size; i > 0; --i) result += chars[Math.floor(random() * chars.length)];

  return result;
}

function randSequence(options) {
  if (options != null && options.charType && !(options != null && options.chars)) {
    switch (options.charType) {
      case 'alpha':
        return fake(() => generator$1(options == null ? void 0 : options.size, `${alphaChars}${alphaChars.toUpperCase()}`), options);

      case 'alphaNumeric':
        return fake(() => generator$1(options == null ? void 0 : options.size, numericAlphaChars), options);

      case 'numeric':
        return fake(() => generator$1(options == null ? void 0 : options.size, numericChars), options);
    }
  } else {
    return fake(() => generator$1(options == null ? void 0 : options.size, options == null ? void 0 : options.chars), options);
  }
}
/**
 * Get a random alpha.
 *
 * @category text
 *
 * @example
 *
 * randAlpha()
 *
 * @example
 *
 * randAlpha({ length: 3 })
 *
 */


function randAlpha(options) {
  return fake(alphaChars.split(''), options);
}
/**
 * Generate a random boolean.
 *
 * @category general
 *
 * @example
 *
 * randBoolean()
 *
 * @example
 *
 * randBoolean({ length: 10 })
 *
 */


function randBoolean(options) {
  return fake(() => randElement([true, false]), options);
}
/**
 * Generate a random number.
 *
 * @category general, math
 *
 * @example
 *
 * randNumber()
 *
 * @example
 *
 * randNumber({ length: 10 })
 *
 * @example
 *
 * randNumber({ min: 10, max: 1000 }) // default is 'min': 0, 'max': 999_999
 *
 * @example
 *
 * randNumber({ min: 0.1, max: 1, fraction: 2 }) // 0.37
 *
 * @example
 *
 * randNumber({ min: 1000, max: 100000, precision: 1000 }) // 67_000
 *
 * @example
 *
 * randNumber({ min: 1000, max: 2000, precision: 100 }) // 1_200
 *
 * @example
 *
 * randNumber({ min: 1000, max: 2000, precision: 10 }) // 1_250
 */


function randNumber(options) {
  const normalized = {
    min: (options == null ? void 0 : options.min) || 0,
    max: (options == null ? void 0 : options.max) || 999999,
    precision: options == null ? void 0 : options.precision,
    fraction: options == null ? void 0 : options.fraction
  };
  return fake(() => {
    const num = getRandomInRange(normalized);

    if (normalized.precision !== undefined) {
      return Math.floor(num / normalized.precision) * normalized.precision;
    }

    return num;
  }, options);
}
/**
 * Get a random alpha or numeric.
 *
 * @category text
 *
 * @example
 *
 * randAlphaNumeric()
 *
 * @example
 *
 * randAlphaNumeric({ length: 3 })
 *
 */


function randAlphaNumeric(options) {
  return fake(() => randBoolean() ? randAlpha() : randNumber({
    min: 0,
    max: 9
  }), options);
}

var data$1V = ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans"];
/**
 * Generate a random american football team.
 *
 * @category sports
 *
 * @example
 *
 * randAmericanFootballTeam()
 *
 * @example
 *
 * randAmericanFootballTeam({ length: 10 })
 *
 */

function randAmericanFootballTeam(options) {
  return fake(data$1V, options);
}

function randAmount(options) {
  var _options$fraction, _options$symbol;

  const amountOptions = Object.assign({}, options, {
    fraction: (_options$fraction = options == null ? void 0 : options.fraction) != null ? _options$fraction : 2
  });
  const symbol = (_options$symbol = options == null ? void 0 : options.symbol) != null ? _options$symbol : '';

  const factory = () => {
    const num = getRandomInRange(amountOptions);
    return symbol ? `${symbol}${num}` : num;
  };

  return fake(factory, options);
}

var data$1U = ["bird", "cetacean", "rabbit", "bear", "cat", "snake", "cow", "insect", "crocodile", "horse", "fish", "dog", "lion"];
/**
 * Generate a random animal type.
 *
 * @category animals
 *
 * @example
 *
 * randAnimalType()
 *
 * @example
 *
 * randAnimalType({ length: 10 })
 *
 */

function randAnimalType(options) {
  return fake(data$1U, options);
}

var data$1T = ["us-east-2", "us-east-1", "us-west-1", "us-west-2", "af-south-1", "ap-east-1", "ap-southeast-3", "ap-south-1", "ap-northeast-3", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2", "eu-south-1", "eu-west-3", "eu-north-1", "me-south-1", "sa-east-1", "us-gov-east-1", "us-gov-west-1"];
/**
 * Generate a random AWS region.
 *
 * @category AWS
 *
 * @example
 *
 * randAwsRegion()
 *
 * @example
 *
 * randAwsRegion({ length: 10 })
 *
 */

function randAwsRegion(options) {
  return fake(data$1T, options);
}

var data$1S = ["/usr/X11R6", "/sys", "/mnt", "/Network", "/usr/libdata", "/Library", "/sbin", "/tmp", "/usr/local/src", "/boot/defaults", "/etc/mail", "/bin", "/boot", "/var/tmp", "/etc/namedb", "/private/var", "/var/mail", "/opt", "/opt/lib", "/proc", "/usr/include", "/usr/src", "/home/user", "/selinux", "/usr/libexec", "/dev", "/etc/defaults", "/usr", "/usr/share", "/rescue", "/private", "/usr/sbin", "/home/user/dir", "/Users", "/var", "/lost+found", "/usr/bin", "/etc/ppp", "/var/spool", "/var/yp", "/usr/ports", "/private/tmp", "/usr/obj", "/home", "/media"];
/**
 * Generate a random directory path.
 *
 * @category system
 *
 * @example
 *
 * randDirectoryPath()
 *
 * @example
 *
 * randDirectoryPath({ length: 10 })
 *
 */

function randDirectoryPath(options) {
  return fake(data$1S, options);
}

var data$1R = ["markets", "solid_backing_strategist", "granite", "synthesizing_executive_specialist", "ecuador", "calculate_island", "nevada", "gloves_manat_delaware", "loan_saint", "client_server", "kroon", "investor", "dynamic_portal", "pixel", "concrete", "nuevo_avon_market", "productize_withdrawal_override", "operative_sum_bypassing", "visionary_online_account", "balboa", "sql_connecting", "incredible_azure_interface", "open_source_netherlands_copying", "hack_hard_thailand", "berkshire_car_micronesia", "pound_program_handmade", "implement_nevada", "home", "agp", "berkshire_investment_tasty", "licensed_pink_fundamental", "concrete_encompassing", "holistic", "application_saint_infrastructureg", "visionary", "towels_visionary_ergonomic", "scalable_jewelery_sudan", "revolutionary", "global_fresh_open_source", "png_capacitor_quantify", "automotive", "action_items", "soap_unbranded", "music_payment_payment", "chips_taiwan", "payment", "intelligent_connecting_account", "capacitor_bypass", "tools_vatu", "interface", "e_markets", "transmit_borders_input", "invoice", "ball_orange", "morph_magnetic", "team_oriented_ivory", "concrete_compress", "market_hack", "wireless_frictionless_chicken", "png", "turquoise_territories_berkshire", "back_end", "withdrawal_paradigm_matrix", "payment_context_sensitive_wisconsin", "unbranded_json_wooden", "invoice_sleek_customized", "silver_copying", "licensed", "plug_and_play", "cultivate_orchestrator", "quantifying_quantify_norway", "account_borders_gourde", "quantifyg", "open_architected_content_based_protocol", "administrator", "synthesizing", "metrics", "white_wireless_garden", "berkshireg", "nepal_view_protocol", "calculating_shirt", "fuchsia_reintermediate_fish", "extend", "matrix", "peso", "superstructure_value_added_redundant", "national_world_classv", "yellowv", "moratorium", "views", "metal_drive_sports", "ports_pink_overriding", "borders", "supply_chains_client_driven_dynamic", "shirt_moratorium_place", "calculate", "protocol_engineer_azerbaijan", "chair_rss", "b2b_belarussian", "fiji"];
/**
 * Generate a random file name.
 *
 * @category system
 *
 * @example
 *
 * randFileName()
 *
 * @example
 *
 * randFileName({ length: 10 })
 *
 */

function randFileName(options) {
  var _options$extension;

  const ext = (_options$extension = options == null ? void 0 : options.extension) != null ? _options$extension : 'pdf';
  return fake(() => `${randElement(data$1R)}.${ext}`, options);
}

const partitions = ['aws', 'aws-cn', 'aws-us-gov'];
const services = ['s3', 'sqs', 'lambda', 'iam'];
const serviceArn = {
  s3: () => `::${randDirectoryPath()}/*`,
  iam: () => `:${randAccount()}:${fake(['user', 'group'])}/*`,
  sqs: () => `${randAwsRegion()}:${randAccount()}:queue${randNumber({
    min: 1,
    max: 10
  })}`,
  lambda: () => `${randAwsRegion()}:${randAccount()}:function:${randFileName().replace(/_/g, '-')}`
};
/**
 * Generate a random ARN.
 *
 * @category AWS
 *
 * @example
 *
 * randArn()
 *
 * @example
 *
 * randArn({ length: 10 })
 *
 */

function randArn(options) {
  return fake(() => {
    const partition = fake(partitions);
    const service = fake(services);
    return `arn:${partition}:${service}:${serviceArn[service]()}`;
  }, options);
}
/**
 * Generate a random avatar.
 *
 * @category person
 *
 * @example
 *
 * randAvatar()
 *
 * @example
 *
 * randAvatar({ length: 10 })
 *
 * @example
 *
 * randAvatar({ size: 200 }) // default is 100
 *
 */


function randAvatar(options) {
  var _options$size;

  const size = (_options$size = options == null ? void 0 : options.size) != null ? _options$size : 100;
  return fake(() => `https://i.pravatar.cc/${size}`, options);
}

var data$1Q = ["EC2", "RDS", "S3", "Lambda", "CloudFront", "Glacier", "SNS", "SQS", "EBS", "VPC", "Kinesis", "Kinesis Data Firehose", "Dynamo DB", "ElastiCache", "CloudWatch", "Cognito", "Cognito", "API Gateway", "AppSync", "Athena"];
/**
 * Generate a random AWS service name.
 *
 * @category AWS
 *
 * @example
 *
 * randAwsService()
 *
 * @example
 *
 * randAwsService({ length: 10 })
 *
 */

function randAwsService(options) {
  return fake(data$1Q, options);
}
/**
 * Generate a random AWS request id.
 *
 * @category AWS
 *
 * @example
 *
 * randAwsRequestId()
 *
 * @example
 *
 * randAwsRequestId({ length: 10 })
 *
 */


function randAwsRequestId(options) {
  const generator = () => {
    return [randAlphaNumeric({
      length: 8
    }), randAlphaNumeric({
      length: 4
    }), randAlphaNumeric({
      length: 4
    }), randAlphaNumeric({
      length: 4
    }), randAlphaNumeric({
      length: 12
    })].map(v => v.join('')).join('-');
  };

  return fake(generator, options);
}

var data$1P = ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"];
/**
 * Generate a random baseball team.
 *
 * @category sports
 *
 * @example
 *
 * randBaseballTeam()
 *
 * @example
 *
 * randBaseballTeam({ length: 10 })
 *
 */

function randBaseballTeam(options) {
  return fake(data$1P, options);
}

var data$1O = ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"];
/**
 * Generate a random basketball team.
 *
 * @category sports
 *
 * @example
 *
 * randBasketballTeam()
 *
 * @example
 *
 * randBasketballTeam({ length: 10 })
 *
 */

function randBasketballTeam(options) {
  return fake(data$1O, options);
}

var data$1N = ["Spectacled bear", "Brown bear", "Asian black bear", "Sun bear", "Polar bear", "Giant panda", "Sloth bear", "American black bear"];
/**
 * Generate a random bear.
 *
 * @category animals
 *
 * @example
 *
 * randBear()
 *
 * @example
 *
 * randBear({ length: 10 })
 *
 */

function randBear(options) {
  return fake(data$1N, options);
}
/**
 * Generate a random date between ranges.
 *
 * @category date
 *
 * @example
 *
 * randBetweenDate({ from: new Date('10/07/2020'), to: new Date() })
 *
 * @example
 *
 * randBetweenDate({ from: new Date('10/07/2020'), to: new Date(), length: 10 })
 *
 */


function randBetweenDate(options) {
  const from = new Date(options.from).getTime();
  const to = new Date(options.to).getTime();

  if (from >= to) {
    throw new Error('From must be before to');
  }

  const generator = () => {
    return new Date(randNumber({
      min: from,
      max: to
    }));
  };

  return fake(generator, options);
}

var data$1M = ["MS", "TW", "LR", "HU", "PK", "GQ", "GG", "SZ", "MQ", "AS", "WS", "BJ", "NR", "FJ", "ZM", "CR", "BO", "AW", "AI", "GW", "PF", "MO", "PE", "UZ", "JM", "KH", "RW", "GN", "IN", "MR", "MC", "KG", "SA", "SV", "TZ", "ME", "BB", "IE", "LY", "TM", "SN", "MA", "BN", "ML", "LV", "SM", "HT", "NF", "TD", "UA", "FM", "KM", "CN", "GF", "MT", "RO", "PA", "FI", "BG", "KZ", "PN", "BL", "NO", "IM", "AQ", "MV", "LA", "NU", "LS", "CW", "CF", "GT", "TL", "RU", "BQ", "GB", "BV", "TC", "EC", "NG", "AD", "RE", "SL", "CL", "ER"];
/**
 * Generate a random country code.
 *
 * @category address
 *
 * @example
 *
 * randCountryCode()
 *
 * @example
 *
 * randCountryCode({ length: 10 })
 *
 */

function randCountryCode(options) {
  return fake(data$1M, options);
}
/**
 * Generate a random swift bic code.
 *
 * @category finance
 *
 * @example
 *
 * randSwift()
 *
 * @example
 *
 * randSwift({ bankCode: 'DEUT' }) // bank code of Deutsche Bank
 *
 * @example
 *
 * randSwift({ countryCode: 'DE' }) // country code with ISO country code
 *
 * @example
 *
 * randSwift({ locationCode: 'MM' }) // location code for Milan MM or for Frankfurt FF and etc
 *
 * @example
 *
 * randSwift({ branchCode: '250' }) // bank branch code
 *
 * @example
 *
 * randSwift({ fillBranchCode: true }) // bank branch code filled with XXX
 *
 * @example
 *
 * randSwift({ length: 10 })
 *
 */


function randSwift(options) {
  var _options$bankCode, _options$countryCode, _options$locationCode, _options$branchCode;

  if (options != null && options.bankCode && (options == null ? void 0 : (_options$bankCode = options.bankCode) == null ? void 0 : _options$bankCode.length) !== 4) {
    throw new Error('bank code should be valid 4 letters. For example DEUT');
  }

  if (options != null && options.countryCode && (options == null ? void 0 : (_options$countryCode = options.countryCode) == null ? void 0 : _options$countryCode.length) !== 2) {
    throw new Error('country code should be valid ISO 3166-1 alpha-2 two-letter country code, for example: DE');
  }

  if (options != null && options.locationCode && (options == null ? void 0 : (_options$locationCode = options.locationCode) == null ? void 0 : _options$locationCode.length) !== 2) {
    throw new Error('location code should be valid 2 characters, like FF or MM');
  }

  if (options != null && options.branchCode && (options == null ? void 0 : (_options$branchCode = options.branchCode) == null ? void 0 : _options$branchCode.length) !== 3) {
    throw new Error('branch code should be valid 3 alpha numberic characters, like XXX or 250');
  }

  const factory = () => {
    var _options$bankCode2, _options$countryCode2, _options$locationCode2, _options$branchCode2;

    const bankCode = (_options$bankCode2 = options == null ? void 0 : options.bankCode) != null ? _options$bankCode2 : '####'.replace(/#/g, () => {
      return randAlpha();
    });
    const countryCode = (_options$countryCode2 = options == null ? void 0 : options.countryCode) != null ? _options$countryCode2 : randCountryCode();
    const locationCode = (_options$locationCode2 = options == null ? void 0 : options.locationCode) != null ? _options$locationCode2 : '##'.replace(/#/g, () => {
      return randAlpha();
    });
    const branchCode = (_options$branchCode2 = options == null ? void 0 : options.branchCode) != null ? _options$branchCode2 : '###'.replace(/#/g, () => {
      return randAlphaNumeric().toString();
    });
    return `${bankCode}${countryCode}${locationCode}${options != null && options.fillBranchCode ? 'XXX' : branchCode}`.toUpperCase();
  };

  return fake(factory, options);
}
/**
 * Generate a random swift bic code.
 *
 * @category finance
 *
 * @example
 *
 * randBic()
 *
 * @example
 *
 * randBic({ bankCode: 'DEUT' }) // bank code of Deutsche Bank
 *
 * @example
 *
 * randBic({ countryCode: 'DE' }) // country code with ISO country code
 *
 * @example
 *
 * randBic({ locationCode: 'MM' }) // location code for Milan MM for Frankfurt FF and etc
 *
 * @example
 *
 * randBic({ branchCode: '250' }) // bank branch code
 *
 * @example
 *
 * randBic({ fillBranchCode: true }) // bank branch code filled with XXX
 *
 * @example
 *
 * randBic({ length: 10 })
 *
 */


function randBic(options) {
  const _options = Object.assign({}, options, {
    length: undefined
  });

  const factory = () => {
    return randSwift(_options).toString();
  };

  return fake(factory, options);
}
/**
 * Generate a random binary.
 *
 * @category Math
 *
 * @example
 *
 * randBinary()
 *
 * @example
 *
 * randBinary({ length: 10 })
 *
 */


function randBinary(options) {
  return fake(() => {
    const RADIX = 2;
    const randomNumber = getRandomInRange({
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      fraction: 0
    });
    return BigInt(randomNumber.toString(RADIX)).toString();
  }, options);
}

var data$1L = ["Red-necked Phalarope", "Cliff Swallow", "Loggerhead Kingbird", "Aztec Thrush", "Hooded Warbler", "Common Pochard", "Scotts Oriole", "Black-browed Albatross", "Monk Parakeet", "Magnificent Hummingbird", "Broad-billed Sandpiper", "Bushtit", "Mexican Jay", "Hooded Merganser", "Wood Stork", "Rosss Gull", "Green Sandpiper", "Whooping Crane"];
/**
 * Generate a random bird.
 *
 * @category animals
 *
 * @example
 *
 * randBird()
 *
 * @example
 *
 * randBird({ length: 10 })
 *
 */

function randBird(options) {
  return fake(data$1L, options);
}
/**
 * Generate a random bitcoin-address.
 *
 * @category finance
 *
 * @example
 *
 * randBitcoinAddress()
 *
 * @example
 *
 * randBitcoinAddress({ length: 10 })
 *
 */


function randBitcoinAddress(options) {
  return fake(() => randSequence({
    size: 33
  }), options);
}

var data$1K = [{
  title: "The Adventures of Augie March",
  author: "Saul Bellow",
  category: "Comedy"
}, {
  title: "The Uncommon Reader",
  author: "Alan Bennett",
  category: "Comedy"
}, {
  title: "Don Quixote",
  author: "Miguel de Cervantes",
  category: "Comedy"
}, {
  title: "Tom Jones",
  author: "Henry Fielding",
  category: "Comedy"
}, {
  title: "Dead Souls",
  author: "Nikolai Gogol",
  category: "Comedy"
}, {
  title: "The Wind in the Willows",
  author: "Kenneth Grahame",
  category: "Comedy"
}, {
  title: "Our Man in Havana",
  author: "Graham Greene",
  category: "Comedy"
}, {
  title: "Catch-22",
  author: "Joseph Heller",
  category: "Comedy"
}, {
  title: "High Fidelity",
  author: "Nick Hornby",
  category: "Comedy"
}, {
  title: "Three Men in a Boat",
  author: "Jerome K Jerome",
  category: "Comedy"
}, {
  title: "Finnegans Wake",
  author: "James Joyce",
  category: "Comedy"
}, {
  title: "Puckoon",
  author: "Spike Milligan",
  category: "Comedy"
}, {
  title: "Portnoy’s Complaint",
  author: "Philip Roth",
  category: "Comedy"
}, {
  title: "Great Apes",
  author: "Will Self",
  category: "Comedy"
}, {
  title: "The Life and Opinions of Tristram Shandy, Gentleman",
  author: "Laurence Sterne",
  category: "Comedy"
}, {
  title: "A Confederacy of Dunces",
  author: "John Kennedy Toole",
  category: "Comedy"
}, {
  title: "Breakfast of Champions",
  author: "Kurt Vonnegut",
  category: "Comedy"
}, {
  title: "Infinite Jest",
  author: "David Foster Wallace",
  category: "Comedy"
}, {
  title: "Molesworth",
  author: "Geoffrey Willans and Ronald Searle",
  category: "Comedy"
}, {
  title: "Thank You Jeeves",
  author: "PG Wodehouse",
  category: "Comedy"
}, {
  title: "The Thirty-Nine Steps",
  author: "John Buchan",
  category: "Crime"
}, {
  title: "The Big Sleep",
  author: "Raymond Chandler",
  category: "Crime"
}, {
  title: "And Then There Were None",
  author: "Agatha Christie",
  category: "Crime"
}, {
  title: "The Hound of the Baskervilles",
  author: "Arthur Conan Doyle",
  category: "Crime"
}, {
  title: "The Manchurian Candidate",
  author: "Richard Condon",
  category: "Crime"
}, {
  title: "The Andromeda Strain",
  author: "Michael Crichton",
  category: "Crime"
}, {
  title: "The Ipcress File",
  author: "Len Deighton",
  category: "Crime"
}, {
  title: "Crime and Punishment",
  author: "Fyodor Dostoevsky",
  category: "Crime"
}, {
  title: "The Count of Monte Cristo",
  author: "Alexandre Dumas",
  category: "Crime"
}, {
  title: "The Day of the Jackal",
  author: "Frederick Forsyth",
  category: "Crime"
}, {
  title: "The Third Man",
  author: "Graham Greene",
  category: "Crime"
}, {
  title: "A Time to Kill",
  author: "John Grisham",
  category: "Crime"
}, {
  title: "The Thin Man",
  author: "Dashiell Hammett",
  category: "Crime"
}, {
  title: "The Talented Mr Ripley",
  author: "Patricia Highsmith",
  category: "Crime"
}, {
  title: "Tinker, Tailor, Soldier, Spy",
  author: "John le Carre",
  category: "Crime"
}, {
  title: "To Kill a Mockingbird",
  author: "Harper Lee",
  category: "Crime"
}, {
  title: "No Country for Old Men",
  author: "Cormac McCarthy",
  category: "Crime"
}, {
  title: "The Godfather",
  author: "Mario Puzo",
  category: "Crime"
}, {
  title: "The Crying of Lot 49",
  author: "Thomas Pynchon",
  category: "Crime"
}, {
  title: "Judgment in Stone",
  author: "Ruth Rendell",
  category: "Crime"
}, {
  title: "Little Women",
  author: "Louisa May Alcott",
  category: "Family and Self"
}, {
  title: "Le Pere Goriot",
  author: "Honore de Balzac",
  category: "Family and Self"
}, {
  title: "The Outsider",
  author: "Albert Camus",
  category: "Family and Self"
}, {
  title: "Great Expectations",
  author: "Charles Dickens",
  category: "Family and Self"
}, {
  title: "The Sound and the Fury",
  author: "William Faulkner",
  category: "Family and Self"
}, {
  title: "Howards End",
  author: "EM Forster",
  category: "Family and Self"
}, {
  title: "The Power and the Glory",
  author: "Graham Greene",
  category: "Family and Self"
}, {
  title: "Steppenwolf",
  author: "Herman Hesse",
  category: "Family and Self"
}, {
  title: "A Prayer for Owen Meany",
  author: "John Irving",
  category: "Family and Self"
}, {
  title: "Ulysses",
  author: "James Joyce",
  category: "Family and Self"
}, {
  title: "One Flew Over the Cuckoo’s Nest",
  author: "Ken Kesey",
  category: "Family and Self"
}, {
  title: "How Green was My Valley",
  author: "Richard Llewellyn",
  category: "Family and Self"
}, {
  title: "The Bluest Eye",
  author: "Toni Morrison",
  category: "Family and Self"
}, {
  title: "Who Do You Think You Are?",
  author: "Alice Munro",
  category: "Family and Self"
}, {
  title: "The Bell Jar",
  author: "Sylvia Plath",
  category: "Family and Self"
}, {
  title: "Remembrance of Things Past",
  author: "Marcel Proust",
  category: "Family and Self"
}, {
  title: "The Catcher in the Rye",
  author: "JD Salinger",
  category: "Family and Self"
}, {
  title: "The Color Purple",
  author: "Alice Walker",
  category: "Family and Self"
}, {
  title: "Jimmy Corrigan, The Smarest Kid on Earth",
  author: "Chris Ware",
  category: "Family and Self"
}, {
  title: "The Picture of Dorian Gray",
  author: "Oscar Wilde",
  category: "Family and Self"
}, {
  title: "Pride and Prejudice",
  author: "Jane Austen",
  category: "Love"
}, {
  title: "Jane Eyre",
  author: "Charlotte Bronte",
  category: "Love"
}, {
  title: "Wuthering Heights",
  author: "Emily Bronte",
  category: "Love"
}, {
  title: "Breakfast at Tiffany’s",
  author: "Truman Capote",
  category: "Love"
}, {
  title: "Rebecca",
  author: "Daphne du Maurier",
  category: "Love"
}, {
  title: "Daniel Deronda",
  author: "George Eliot",
  category: "Love"
}, {
  title: "The Great Gatsby",
  author: "F Scott Fitzgerald",
  category: "Love"
}, {
  title: "Madame Bovary",
  author: "Gustave Flaubert",
  category: "Love"
}, {
  title: "A Room with a View",
  author: "EM Forster",
  category: "Love"
}, {
  title: "The Sorrows of Young Werther",
  author: "Johann Wolfgang Goethe",
  category: "Love"
}, {
  title: "Far From the Madding Crowd",
  author: "Thomas Hardy",
  category: "Love"
}, {
  title: "The Scarlet Letter",
  author: "Nathaniel Hawthorne",
  category: "Love"
}, {
  title: "The Remains of the Day",
  author: "Kazuo Ishiguro",
  category: "Love"
}, {
  title: "Les Liaisons Dangereuses",
  author: "Pierre-Ambroise-Francois Choderlos de Laclos",
  category: "Love"
}, {
  title: "Of Human Bondage",
  author: "Somerset Maugham",
  category: "Love"
}, {
  title: "Atonement",
  author: "Ian McEwan",
  category: "Love"
}, {
  title: "Gone With the Wind",
  author: "Margaret Mitchell",
  category: "Love"
}, {
  title: "Norwegian Wood",
  author: "Haruki Murakami",
  category: "Love"
}, {
  title: "Doctor Zhivago",
  author: "Boris Pasternak",
  category: "Love"
}, {
  title: "Wide Sargasso Sea",
  author: "Jean Rhys",
  category: "Love"
}, {
  title: "The Hitchhikers Guide to the Galaxy",
  author: "Douglas Adams",
  category: "Science Fiction and Fantasy"
}, {
  title: "Foundation",
  author: "Isaac Asimov",
  category: "Science Fiction and Fantasy"
}, {
  title: "Fahrenheit 451",
  author: "Ray Bradbury",
  category: "Science Fiction and Fantasy"
}, {
  title: "Alice’s Adventures in Wonderland",
  author: "Lewis Carroll",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Man who was Thursday",
  author: "GK Chesterton",
  category: "Science Fiction and Fantasy"
}, {
  title: "Childhood’s End",
  author: "Arthur C Clarke",
  category: "Science Fiction and Fantasy"
}, {
  title: "Do Androids Dream of Electric Sheep?",
  author: "Philip K Dick",
  category: "Science Fiction and Fantasy"
}, {
  title: "American Gods",
  author: "Neil Gaiman",
  category: "Science Fiction and Fantasy"
}, {
  title: "Neuromancer",
  author: "William Gibson",
  category: "Science Fiction and Fantasy"
}, {
  title: "Dune",
  author: "Frank L Herbert",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Turn of the Screw",
  author: "Henry James",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Shining",
  author: "Stephen King",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Earthsea Series",
  author: "Ursula Le Guin",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Chronicles of Narnia",
  author: "CS Lewis",
  category: "Science Fiction and Fantasy"
}, {
  title: "Nineteen Eighty-Four",
  author: "George Orwell",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Discworld Series",
  author: "Terry Pratchett",
  category: "Science Fiction and Fantasy"
}, {
  title: "Frankenstein",
  author: "Mary Shelley",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Strange Case of Dr Jekyll and Mr Hyde",
  author: "Robert Louis Stevenson",
  category: "Science Fiction and Fantasy"
}, {
  title: "Dracula",
  author: "Bram Stoker",
  category: "Science Fiction and Fantasy"
}, {
  title: "The Lord of the Rings",
  author: "JRR Tolkien",
  category: "Science Fiction and Fantasy"
}, {
  title: "Things Fall Apart",
  author: "Chinua Achebe",
  category: "State of the Nation"
}, {
  title: "Go Tell it on the Mountain",
  author: "James Baldwin",
  category: "State of the Nation"
}, {
  title: "Uncle Tom’s Cabin",
  author: "Harriet Beecher Stowe",
  category: "State of the Nation"
}, {
  title: "Moll Flanders",
  author: "Daniel Defoe",
  category: "State of the Nation"
}, {
  title: "A Tale of Two Cities",
  author: "Charles Dickens",
  category: "State of the Nation"
}, {
  title: "North and South",
  author: "Elizabeth Gaskell",
  category: "State of the Nation"
}, {
  title: "Les Miserables",
  author: "Victor Hugo",
  category: "State of the Nation"
}, {
  title: "A Girl in Winter",
  author: "Philip Larkin",
  category: "State of the Nation"
}, {
  title: "The Magic Mountain",
  author: "Thomas Mann",
  category: "State of the Nation"
}, {
  title: "Bel-Ami",
  author: "Guy de Maupassant",
  category: "State of the Nation"
}, {
  title: "Animal Farm",
  author: "George Orwell",
  category: "State of the Nation"
}, {
  title: "Cry, the Beloved Country",
  author: "Alan Paton",
  category: "State of the Nation"
}, {
  title: "The Jungle",
  author: "Upton Sinclair",
  category: "State of the Nation"
}, {
  title: "White Teeth",
  author: "Zadie Smith",
  category: "State of the Nation"
}, {
  title: "The Grapes of Wrath",
  author: "John Steinbeck",
  category: "State of the Nation"
}, {
  title: "Vanity Fair",
  author: "William Makepeace Thackeray",
  category: "State of the Nation"
}, {
  title: "The Way We Live Now",
  author: "Anthony Trollope",
  category: "State of the Nation"
}, {
  title: "The Adventures of Tom Sawyer",
  author: "Mark Twain",
  category: "State of the Nation"
}, {
  title: "The Bonfire of the Vanities",
  author: "Tom Wolfe",
  category: "State of the Nation"
}, {
  title: "Germinal",
  author: "Emile Zola",
  category: "State of the Nation"
}, {
  title: "Empire of the Sun",
  author: "JG Ballard",
  category: "War and Travel"
}, {
  title: "Heart of Darkness",
  author: "Joseph Conrad",
  category: "War and Travel"
}, {
  title: "Robinson Crusoe",
  author: "Daniel Defoe",
  category: "War and Travel"
}, {
  title: "The Three Musketeers",
  author: "Alexandre Dumas",
  category: "War and Travel"
}, {
  title: "King Solomon’s Mines",
  author: "H Rider Haggard",
  category: "War and Travel"
}, {
  title: "Enigma",
  author: "Robert Harris",
  category: "War and Travel"
}, {
  title: "The Good Soldier Svejk",
  author: "Jaroslav Hasek",
  category: "War and Travel"
}, {
  title: "For Whom the Bell Tolls",
  author: "Ernest Hemingway",
  category: "War and Travel"
}, {
  title: "On the Road",
  author: "Jack Kerouac",
  category: "War and Travel"
}, {
  title: "The Call of the Wild",
  author: "Jack London",
  category: "War and Travel"
}, {
  title: "One Hundred Years of Solitude",
  author: "Gabriel Garcia Marquez",
  category: "War and Travel"
}, {
  title: "Moby-Dick or, The Whale",
  author: "Herman Melville",
  category: "War and Travel"
}, {
  title: "Zen and the Art of Motorcycle Maintenance",
  author: "Robert Pirsig",
  category: "War and Travel"
}, {
  title: "All Quiet on the Western Front",
  author: "Erich Maria Remarque",
  category: "War and Travel"
}, {
  title: "Ivanhoe",
  author: "Sir Walter Scott",
  category: "War and Travel"
}, {
  title: "Treasure Island",
  author: "Robert Louis Stevenson",
  category: "War and Travel"
}, {
  title: "Gulliver’s Travels",
  author: "Jonathan Swift",
  category: "War and Travel"
}, {
  title: "War and Peace",
  author: "Leo Tolstoy",
  category: "War and Travel"
}, {
  title: "Around the World in Eighty Days",
  author: "Jules Verne",
  category: "War and Travel"
}, {
  title: "The Caine Mutiny",
  author: "Herman Wouk",
  category: "War and Travel"
}];
/**
 * Generate a random book.
 *
 * @category entities
 *
 * @example
 *
 * randBook()
 *
 * @example
 *
 * randBook({ length: 10 })
 *
 * @example
 *
 * randBook({ category: 'Comedy' })
 *
 */

function randBook(options) {
  const bookData = options != null && options.category ? data$1K.filter(({
    category
  }) => category === options.category) : data$1K;
  return fake(bookData, options);
}

var data$1J = ["Apple", "Amazon", "Microsoft", "Google", "Samsung", "Coca-Cola", "Toyota", "Mercedes", "McDonald’s", "Disney", "BMW", "Intel", "Facebook", "IBM", "Nike", "Cisco", "Louis Vuitton", "SAP", "Instagram", "Honda", "Chanel", "J.P. Morgan", "American Express", "UPS", "Ikea", "Pepsi", "Adobe", "Hermès", "General Electric", "YouTube", "Accenture", "Gucci", "Budweiser", "Pampers", "Zara", "Hyundai", "H&M", "Nescafé", "Allianz", "Tesla", "Netflix", "Ford", "L'Oreal", "Audi", "Visa", "Ebay", "Volkswagen", "AXA", "Goldman Sachs", "Adidas", "Sony", "Citi", "Philips", "Gillette", "Porsche", "Starbucks", "Mastercard", "Salesforce", "Nissan", "PayPal", "Siemens", "Danone", "Nestlé", "HSBC", "Hewlett Packard", "Kellogg's", "3M", "Colgate", "Morgan Stanely", "Spotify", "Canon", "Lego", "Cartier", "Santander", "FedEx", "Nintendo", "Hewlett Packard Enterprise", "Corona", "Ferrari", "Huawei", "DHL", "Jack Daniel's", "Dior", "Caterpillar", "Panasonic", "Kia", "Johnson & Johnson", "Heineken", "John Deere", "LinkedIn", "Hennessy", "KFC", "Land Rover", "Tiffany & Co.", "Mini", "Uber", "Burberry", "Johnnie Walker", "Prada", "Zoom"];
/**
 * Generate a random brand.
 *
 * @category company
 *
 * @example
 *
 * randBrand()
 *
 * @example
 *
 * randBrand({ length: 10 })
 *
 */

function randBrand(options) {
  return fake(data$1J, options);
}

var data$1I = ["Chrome", "Edge", "Firefox", "Internet Explorer", "Safari", "Opera", "Yandex", "Chromium", "Vivaldi", "Baidu", "Brave"];
/**
 * Generate a random browser.
 *
 * @category internet
 *
 * @example
 *
 * randBrowser()
 *
 * @example
 *
 * randBrowser({ length: 10 })
 *
 */

function randBrowser(options) {
  return fake(data$1I, options);
}

var data$1H = ["East", "South", "West", "North"];
/**
 * Generate a random cardinal direction.
 *
 * @category address
 *
 * @example
 *
 * randCardinalDirection()
 *
 * @example
 *
 * randCardinalDirection({ length: 10 })
 *
 */

function randCardinalDirection(options) {
  return fake(data$1H, options);
}

var data$1G = ["Japanese Bobtail", "Savannah", "LaPerm", "Siberian", "Ocicat", "Birman", "Devon Rex", "Minskin", "Serengeti", "Bombay", "Himalayan", "American Curl", "Thai", "Balinese", "Singapura", "American Shorthair", "Ojos Azules", "Burmese"];
/**
 * Generate a random cat.
 *
 * @category animals
 *
 * @example
 *
 * randCat()
 *
 * @example
 *
 * randCat({ length: 10 })
 *
 */

function randCat(options) {
  return fake(data$1G, options);
}

var data$1F = ["Persevering encompassing middleware", "Multi-layered zero administration system engine", "Digitized attitude-oriented implementation", "Multi-lateral zero defect throughput", "Profit-focused coherent application", "Decentralized human-resource system engine", "Right-sized client-driven firmware", "Cloned incremental structure", "Streamlined impactful alliance", "Visionary fresh-thinking instruction set", "Networked exuding monitoring", "Organized contextually-based function", "Enterprise-wide directional orchestration", "Universal empowering product", "Reduced regional frame", "Monitored bottom-line productivity", "Reduced multi-tasking encoding", "Enhanced responsive software", "Multi-tiered exuding approach", "Balanced stable knowledge user", "Re-engineered neutral database", "Versatile national time-frame", "Exclusive fresh-thinking workforce", "Virtual background paradigm", "Upgradable cohesive knowledge user", "De-engineered needs-based hardware", "Networked mobile moratorium", "Inverse contextually-based portal", "De-engineered full-range extranet", "Advanced transitional support", "Business-focused stable framework", "Reactive 4th generation info-mediaries", "Switchable upward-trending array", "Integrated regional open architecture", "Reactive local implementation", "Focused asymmetric contingency", "Synergized 4th generation success", "Mandatory regional complexity", "Proactive client-server access", "Implemented well-modulated task-force", "Pre-emptive clear-thinking groupware", "Balanced radical archive", "Managed explicit installation", "Switchable next generation intranet", "Quality-focused coherent groupware", "Customizable client-driven encoding", "Centralized impactful contingency", "Streamlined executive Graphic Interface", "Seamless bi-directional capacity", "Synchronised 24 hour emulation", "Robust heuristic installation", "Face to face 6th generation complexity", "Vision-oriented holistic protocol", "Ameliorated asynchronous pricing structure", "Profit-focused executive core", "Multi-channelled zero tolerance core", "Customizable global open system", "Robust foreground synergy", "Up-sized eco-centric pricing structure", "Upgradable stable strategy", "Synergized client-server architecture", "Focused logistical definition", "Secured holistic architecture", "Adaptive asymmetric infrastructure", "Digitized clear-thinking firmware", "De-engineered eco-centric installation", "Stand-alone next generation task-force", "User-centric optimizing implementation", "Re-contextualized grid-enabled portal", "Extended asynchronous system engine", "Reactive neutral moderator", "Expanded 4th generation Graphic Interface", "Optimized contextually-based toolset", "Operative bi-directional protocol", "De-engineered dynamic frame", "User-friendly disintermediate alliance", "Fundamental client-server data-warehouse", "Ameliorated multimedia groupware", "Secured methodical frame", "Organized maximized firmware", "User-centric executive knowledge user", "Configurable global help-desk", "Realigned empowering monitoring", "Enterprise-wide 24 hour info-mediaries", "Expanded didactic methodology", "Configurable zero administration projection", "Fundamental multi-tasking standardization", "Future-proofed leading edge secured line", "Polarised global open system", "Re-engineered upward-trending standardization", "Stand-alone needs-based pricing structure", "Synergistic responsive service-desk", "Re-engineered 24/7 paradigm", "Compatible fresh-thinking success", "Innovative background attitude", "Automated modular access", "Distributed heuristic archive", "Cloned human-resource knowledge base", "User-friendly impactful utilisation", "Reactive motivating data-warehouse"];
/**
 * Generate a random catch phrase.
 *
 * @category text
 *
 * @example
 *
 * randCatchPhrase()
 *
 * @example
 *
 * randCatchPhrase({ length: 10 })
 *
 */

function randCatchPhrase(options) {
  return fake(data$1F, options);
}

var data$1E = ["Clymene Dolphin", "Bottlenose Dolphin", "Costero", "Chilean Dolphin", "Heaviside’s Dolphin", "Pantropical Spotted Dolphin", "Sperm Whale", "Burrunan Dolphin", "Bryde’s whale", "Atlantic White-Sided Dolphin", "Northern Rightwhale Dolphin", "Killer Whale (Orca)", "False Killer Whale", "Ganges River Dolphin", "Pacific White-Sided Dolphin", "Blue Whale", "Southern Bottlenose Whale", "Peale’s Dolphin"];
/**
 * Generate a random cetacean.
 *
 * @category animals
 *
 * @example
 *
 * randCetacean()
 *
 * @example
 *
 * randCetacean({ length: 10 })
 *
 */

function randCetacean(options) {
  return fake(data$1E, options);
}

var data$1D = ["South Dagmarshire", "New Solonmouth", "New Montemouth", "Langborough", "Padbergmouth", "Connfurt", "Metairie", "New Merle", "Willbury", "North Sigmund", "Opalbury", "North Antonetta", "Tallahassee", "Janefurt", "Port Adalberto", "West Dorris", "Kettering", "Lake Adell", "Bellingham", "Buffalo", "West Brendonville", "South Laila", "West Lucy", "Marionton", "Lake Brianne", "New Ansley", "Johnnieburgh", "Jaskolskifort", "New Davonteside", "New Kyle", "Williemouth", "Lake Cesar", "Bernierfurt", "West Janetborough", "Port Asa", "East Filibertofurt", "Fort Lauderdale", "West Dellside", "Glen Burnie", "Port Amie", "Shoreline", "West Estaton", "Cuyahoga Falls", "North Kaleighshire", "Kuvalismouth", "South Darienbury", "Venamouth", "North Winnifred", "Bahringertown", "Haneborough", "South Ahmedfort", "East Khalilton", "Aliso Viejo", "Jaquelinview", "Lake Ludie", "West Simone", "Katrinaside", "North Nona", "Tryciastad", "Tabithaville", "Frisco", "Olympia", "State College", "New Garlandfort", "Lake Anthony", "West Everardo", "Wehnerfort", "South Verdieton", "Lawrence", "New Wallaceberg", "White Plains", "South Stacey", "Farmington", "Borerville", "Erynside", "Lake Zackton", "Port Salvador", "Funkville", "North Frankie", "East Vicentaborough", "North Braulio", "East Providence", "Denesikburgh", "New Philip", "Durwardton", "Kissimmee", "North Celia", "Maxwellport", "Reichertland", "Rettaland", "West Amiya", "Elisabethland", "Rogers", "Henderson", "Franeckiview", "Grand Rapids", "Murray", "Port Ricky", "Port Hardymouth", "Cruzshire"];
/**
 * Generate a random city.
 *
 * @category Address
 *
 * @example
 *
 * randCity()
 *
 * @example
 *
 * randCity({ length: 10 })
 *
 */

function randCity(options) {
  return fake(data$1D, options);
}

var data$1C = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
/**
 * Generate a random clothing size.
 *
 * @category Commerce
 *
 * @example
 *
 * randClothingSize()
 *
 * @example
 *
 * randClothingSize({ length: 10 })
 *
 */

function randClothingSize(options) {
  return fake(data$1C, options);
}

var data$1B = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
/**
 * Generate a random color.
 *
 * @category colors
 *
 * @example
 *
 * randColor()
 *
 * @example
 *
 * randColor({ length: 10 })
 *
 */

function randColor(options) {
  return fake(data$1B, options);
}

var data$1A = ["Kautzer, Macejkovic and Fisher", "Greenholt - Mosciski", "Marquardt - Runolfsdottir", "Abernathy Inc", "Dickens - Lang", "Hand, Bernhard and Kessler", "Abbott LLC", "Kub Inc", "Johnston - Wisozk", "Reichert LLC", "Kohler LLC", "Shanahan - Boyle", "Batz - Rice", "Cronin, Oberbrunner and Beier", "Kuhlman, Schowalter and West", "Luettgen Inc", "Ward Group", "Hills and Sons", "Prohaska, Balistreri and Walker", "Rempel - Durgan", "Bernier LLC", "Stehr - Lockman", "Roberts, Rogahn and Dooley", "Lesch - Jakubowski", "Jenkins - Turcotte", "Gerhold - Rowe", "Block - Rau", "Dickinson, Tremblay and Moore", "Nader - Fritsch", "Kreiger and Sons", "Bartell, Wehner and Schowalter", "Hegmann Inc", "Orn, Spencer and Kiehn", "Graham, Sipes and Towne", "Hodkiewicz Inc", "Mills Group", "Legros, Tillman and Hodkiewicz", "Lesch - Carter", "Lesch Group", "Kreiger - Sauer", "Cartwright - Schuster", "Labadie LLC", "Pfannerstill, White and Mosciski", "Jenkins LLC", "Boehm, Hettinger and Huels", "Maggio, Wisoky and Blick", "Kozey Inc", "Stracke - Wisozk", "Olson, Olson and Carter", "Orn, Gerlach and Runolfsdottir", "Stracke - Kertzmann", "Champlin - Gaylord", "Walker - Zieme", "Hodkiewicz - Hintz", "Lind Group", "Fahey, Leannon and Gleichner", "Mertz, Gusikowski and Lemke", "Heidenreich - Aufderhar", "Zboncak and Sons", "Carroll Group", "Brown LLC", "Weber Inc", "Rath LLC", "Walker Inc", "Heller, Hyatt and Jaskolski", "Jacobi - Kutch", "Skiles and Sons", "Durgan - Stamm", "Renner - Prosacco", "Hahn - Welch", "Lesch, Dooley and Bartell", "Crona and Sons", "Rogahn, Armstrong and Goyette", "Lubowitz, Kuhlman and Bailey", "Doyle Group", "Dooley and Sons", "Kerluke LLC", "Bogan - Daniel", "Hintz - Boehm", "Swaniawski and Sons", "Kris, Legros and Cartwright", "Reichel Group", "Russel - Hintz", "Welch, Lockman and Hand", "Pouros - Brakus", "Mohr, Fritsch and Wisozk", "Upton - Reichert", "Koepp and Sons", "Weber and Sons", "Quigley, Bins and Becker", "Strosin, Oberbrunner and Wunsch", "Rodriguez - Spencer", "Wilkinson - Dare", "Gutkowski Inc", "OReilly LLC", "Collins, Mante and Pacocha", "Steuber, Luettgen and Corkery", "Kub and Sons", "Lesch and Sons"];
/**
 * Generate a random company name.
 *
 * @category Company
 *
 * @example
 *
 * randCompanyName()
 *
 * @example
 *
 * randCompanyName({ length: 10 })
 *
 */

function randCompanyName(options) {
  return fake(data$1A, options);
}

var data$1z = ["Argentina", "Peru", "Colombia", "Chile", "Uruguay", "Gabon", "Congo", "Norfolk Island", "Qatar", "Syrian Arab Republic", "Wallis and Futuna", "Somalia", "Saint Barthelemy", "Comoros", "Sri Lanka", "Czech Republic", "Christmas Island", "Macao", "Montenegro", "Anguilla", "Canada", "Mayotte", "Tajikistan", "Afghanistan", "Liechtenstein", "Cocos (Keeling) Islands", "Angola", "Bahrain", "Dominican Republic", "Croatia", "Latvia", "Virgin Islands, U.S.", "United Kingdom", "Brazil", "Spain", "Mongolia", "Montserrat", "Estonia", "Benin", "Guinea", "Guinea-Bissau", "Greece", "Lao Peoples Democratic Republic", "Puerto Rico", "Slovakia (Slovak Republic)", "United States of America", "Switzerland", "Costa Rica", "Mauritius", "Nigeria", "Russian Federation", "Germany", "Antigua and Barbuda", "Albania", "Romania", "Moldova", "Senegal", "Tanzania", "British Indian Ocean Territory (Chagos Archipelago)", "Central African Republic", "New Caledonia", "Burundi", "Panama", "Azerbaijan", "Namibia", "French Southern Territories", "Vanuatu", "Ethiopia", "Burkina Faso", "Tunisia", "Mozambique", "Belarus", "Saint Kitts and Nevis", "Hungary", "Indonesia", "Cyprus", "Ecuador", "Saint Martin", "Nauru", "Faroe Islands", "Iran", "Bolivia", "Pitcairn Islands", "France", "Paraguay", "Isle of Man", "Sierra Leone", "Monaco", "Belize", "Trinidad and Tobago"];
/**
 * Generate a random country.
 *
 * @category address
 *
 * @example
 *
 * randCountry()
 *
 * @example
 *
 * randCountry({ length: 10 })
 *
 */

function randCountry(options) {
  return fake(data$1z, options);
}

var data$1y = ["Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire", "Cheshire", "City of London", "Cornwall", "Cumbria", "Derbyshire", "Devon", "Dorset", "Durham", "East Riding of Yorkshire", "East Sussex", "Essex", "Gloucestershire", "Greater London", "Greater Manchester", "Hampshire", "Herefordshire", "Hertfordshire", "Isle of Wight", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Norfolk", "North Yorkshire", "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire", "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire"];
/**
 * Generate a random county.
 *
 * @category Address
 *
 * @example
 *
 * randCounty()
 *
 * @example
 *
 * randCounty({ length: 10 })
 *
 */

function randCounty(options) {
  return fake(data$1y, options);
}

var data$1x = ["Hartón del Valle", "Pedit", "German Black Pied cattle", "Parda Alpina", "Dajal", "Raya", "Adamawa", "Blaarkop", "Doayo cattle", "Aulie-Ata", "North Bengal Grey", "Nguni", "Canaria", "Siri", "Breed", "Hallikar4", "Simmental", "Pie Rouge des Plaines"];
/**
 * Generate a random cow.
 *
 * @category animals
 *
 * @example
 *
 * randCow()
 *
 * @example
 *
 * randCow({ length: 10 })
 *
 */

function randCow(options) {
  return fake(data$1x, options);
}
/**
 * Generate a random credit card CVV.
 *
 * @category Finance
 *
 * @example
 *
 * randCreditCardCVV()
 *
 * @example
 *
 * randCreditCardCVV({ length: 10 })
 *
 */


function randCreditCardCVV(options) {
  return fake(() => getRandomInRange({
    min: 100,
    max: 999
  }).toString(), options);
}

var data$1w = ["American Express", "T-Union", "UnionPay", "Diners Club", "Discover Card", "UkrCard", "RuPay", "InterPayment", "InstaPayment", "JCB", "Maestro UK", "Maestro", "Dankort", "Mir", "NPS Pridnestrovie", "Mastercard", "51–55", "Troy", "Visa", "Visa Electron", "UATP", "Verve"];
/**
 * Generate a random credit card brand.
 *
 * @category Finance
 *
 * @example
 *
 * randCreditCardBrand()
 *
 * @example
 *
 * randCreditCardBrand({ length: 10 })
 *
 */

function randCreditCardBrand(options) {
  return fake(data$1w, options);
}
/**
 * Get a random item from array.
 *
 * @category general
 *
 * @example
 *
 * rand([ 1, 2, 3 ])
 *
 * @example
 *
 * rand([ 1, 2, 3 ], { length: 10 })
 *
 */


function rand(arr, options) {
  return fake(arr, options);
}

var data$1v = [{
  brand: "American Express",
  formats: ["34## ###### #####", "37## ###### #####"]
}, {
  brand: "UnionPay",
  formats: ["62## #### #### ####", "62#### #############"]
}, {
  brand: "Diners Club",
  formats: ["300# ###### ####", "301# ###### ####", "302# ###### ####", "303# ###### ####", "304# ###### ####", "305# ###### ####", "309# ###### ####", "36## ###### ####", "38## ###### ####", "39## ###### ####", "54## #### #### ####", "55## #### #### ####"]
}, {
  brand: "Discover Card",
  formats: ["6011 #### #### ####", "644# #### #### ####", "645# #### #### ####", "646# #### #### ####", "647# #### #### ####", "648# #### #### ####", "649# #### #### ####", "65## #### #### ####"]
}, {
  brand: "RuPay",
  formats: ["60## #### #### ####", "65## #### #### ####", "81## #### #### ####", "82## #### #### ####", "508# #### #### ####", "353# #### #### ####", "356# #### #### ####"]
}, {
  brand: "JCB",
  formats: ["3528 #### #### ####", "3565 #### #### ####", "3572 #### #### ####", "3589 #### #### ####"]
}, {
  brand: "Maestro",
  formats: ["5018 #### #####", "5020 #### #####", "5038 #### #####", "5893 ###### #####", "6304 #### #### ####", "6759 #### #### ####", "6761 #### #### #### ###", "6762 #### #### ####", "6763 #### #### #### ###"]
}, {
  brand: "Dankort",
  formats: ["5019 #### #### ####"]
}, {
  brand: "Mastercard",
  formats: ["51## #### #### ####", "52## #### #### ####", "53## #### #### ####", "54## #### #### ####", "55## #### #### ####"]
}, {
  brand: "Visa",
  formats: ["4### #### #### ####"]
}, {
  brand: "Visa Electron",
  formats: ["4026 #### #### ####", "4175 00## #### ####", "4405 #### #### ####", "4508 #### #### ####", "4844 #### #### ####", "4913 #### #### ####", "4917 #### #### ####"]
}, {
  brand: "UATP",
  formats: ["1### ##### ######"]
}];
/**
 * Generate a random credit card number.
 *
 * @category finance
 *
 * @example
 *
 * randCreditCardNumber()
 *
 * @example
 *
 * randCreditCardNumber({ brand: 'Visa' })
 *
 * @example
 *
 * randCreditCardNumber({ length: 10 })
 *
 */

function randCreditCardNumber(options) {
  var _options$brand, _data$find;

  const brand = (_options$brand = options == null ? void 0 : options.brand) != null ? _options$brand : rand(Object.keys(data$1v));
  const formats = (_data$find = data$1v.find(card => card.brand === brand)) == null ? void 0 : _data$find.formats;
  const fallBackFormat = ['#### #### #### ####'];

  const factory = () => {
    return randElement(formats || fallBackFormat).replace(/#/g, () => {
      return getRandomInRange({
        min: 0,
        max: 9
      }).toString();
    });
  };

  return fake(factory, options);
}

var data$1u = ["Orinoco Crocodile", "Gharial", "Broad-snouted Caiman", "Saltwater Crocodile", "Black Caiman", "West African Crocodile", "Tomistoma", "Siamese Crocodile", "Philippine Crocodile", "Schneider’s Smooth-fronted Caiman", "Cuban Crocodile", "New Guinea Freshwater Crocodile", "Nile Crocodile", "American Crocodile", "Chinese Alligator", "Dwarf Crocodile", "Yacare Caiman", "African Slender-snouted Crocodile"];
/**
 * Generate a random crocodilia.
 *
 * @category animals
 *
 * @example
 *
 * randCrocodilia()
 *
 * @example
 *
 * randCrocodilia({ length: 10 })
 *
 */

function randCrocodilia(options) {
  return fake(data$1u, options);
}

var data$1t = ["IRR", "SHP", "NPR", "CAD", "XDR", "BMD", "LTL", "XTS", "CRC", "BYR", "GEL", "PGK", "HKD", "LKR", "IQD", "CVE", "BRL", "MGA", "TMT", "ISK", "GIP", "CUC", "SYP", "MWK", "BND", "AFN", "FKP", "GYD", "PAB", "NAD", "ZMK", "ILS", "KMF", "GBP", "JPY", "MUR", "UAH", "EEK", "SLL", "MMK", "NGN", "SDG", "ALL", "TRY", "BTN", "JMD", "AWG", "GTQ", "VEF", "XAF", "DJF", "NIO", "XAU", "COP", "CHF", "HNL", "DOP", "KHR", "EUR", "CLP", "KES", "TND", "DZD", "GNF", "USD", "MAD", "AOA", "SRD", "TWD", "RWF", "XPT", "PKR", "SOS", "SCR", "GHS", "MNT", "BWP", "AED", "RON"];
/**
 * Generate a random currency code.
 *
 * @category finance
 *
 * @example
 *
 * randCurrencyCode()
 *
 * @example
 *
 * randCurrencyCode({ length: 10 })
 *
 */

function randCurrencyCode(options) {
  return fake(data$1t, options);
}

var data$1s = ["Egyptian Pound", "Belize Dollar", "Sudanese Pound", "Palladium", "Mexican Peso", "Rupiah", "Tenge", "Boliviano boliviano", "Vatu", "Lebanese Pound", "Riel", "US Dollar", "Djibouti Franc", "Kwacha", "Hryvnia", "Lari", "Russian Ruble", "Codes specifically reserved for testing purposes", "Kina", "Tunisian Dinar", "Leone", "Brunei Dollar", "Danish Krone", "Nepalese Rupee", "North Korean Won", "Saudi Riyal", "Afghani", "Platinum", "Iraqi Dinar", "Costa Rican Colon", "Singapore Dollar", "Philippine Peso", "Pound Sterling", "Dalasi", "Dobra", "Paanga", "Balboa", "Bermudian Dollar (customarily known as Bermuda Dollar)", "Barbados Dollar", "Pataca", "Kuwaiti Dinar", "CFP Franc", "Uganda Shilling", "Norwegian Krone", "Dong", "Lilangeni", "Croatian Kuna", "Lesotho Loti", "Rufiyaa", "Forint", "Argentine Peso", "Cedi", "Bhutanese Ngultrum", "Dominican Peso", "Somoni", "Guinea Franc", "European Unit of Account 9(E.U.A.-9)", "European Monetary Unit (E.M.U.-6)", "Convertible Marks", "Cuban Peso Convertible", "UAE Dirham", "Iceland Krona", "Gourde", "Som", "Bahamian Dollar", "Kwanza", "Cordoba Oro", "Gold", "Manat", "Burundi Franc", "New Taiwan Dollar", "Fiji Dollar", "Uzbekistan Sum", "Romanian Leu"];
/**
 * Generate a random currency name.
 *
 * @category Finance
 *
 * @example
 *
 * randCurrencyName()
 *
 * @example
 *
 * randCurrencyName({ length: 10 })
 *
 */

function randCurrencyName(options) {
  return fake(data$1s, options);
}

var data$1r = ["B/.", "£", "Ls", "₡", "NT$", "лв", "$", "R", "Lt", "﷼", "kr", "KM", "៛", "Bs", "₹", "Q", "ƒ", "R$", "₨", "ден", "p.", "₺", "Дин.", "P", "RD$", "L", "Ft", "CHF", "₩", "Php", "S/.", "₭", "RM", "€", "Lek", "¥", "؋", "₦"];
/**
 * Generate a random currency symbol.
 *
 * @category finance
 *
 * @example
 *
 * randCurrencySymbol()
 *
 * @example
 *
 * randCurrencySymbol({ length: 10 })
 *
 */

function randCurrencySymbol(options) {
  return fake(data$1r, options);
}

var data$1q = ["utf8_unicode_ci", "cp1250_general_ci", "cp1250_bin", "utf8_general_ci", "ascii_general_ci", "utf8_bin", "ascii_bin"];
/**
 * Generate a random database collation.
 *
 * @category database
 *
 * @example
 *
 * randDatabaseCollation()
 *
 * @example
 *
 * randDatabaseCollation({ length: 10 })
 *
 */

function randDatabaseCollation(options) {
  return fake(data$1q, options);
}

var data$1p = ["comment", "group", "password", "token", "phone", "title", "status", "id", "name", "updatedAt", "category", "email", "avatar", "createdAt"];
/**
 * Generate a random database column.
 *
 * @category database
 *
 * @example
 *
 * randDatabaseColumn()
 *
 * @example
 *
 * randDatabaseColumn({ length: 10 })
 *
 */

function randDatabaseColumn(options) {
  return fake(data$1p, options);
}

var data$1o = ["CSV", "ARCHIVE", "MyISAM", "MEMORY", "InnoDB", "BLACKHOLE"];
/**
 * Generate a random database engine.
 *
 * @category database
 *
 * @example
 *
 * randDatabaseEngine()
 *
 * @example
 *
 * randDatabaseEngine({ length: 10 })
 *
 */

function randDatabaseEngine(options) {
  return fake(data$1o, options);
}

var data$1n = ["tinyint", "date", "timestamp", "set", "datetime", "enum", "binary", "bigint", "point", "smallint", "text", "bit", "decimal", "varchar", "mediumint", "double", "time", "blob", "geometry", "boolean", "serial", "real", "float"];
/**
 * Generate a random database type.
 *
 * @category database
 *
 * @example
 *
 * randDatabaseType()
 *
 * @example
 *
 * randDatabaseType({ length: 10 })
 *
 */

function randDatabaseType(options) {
  return fake(data$1n, options);
}

var data$1m = ["Games", "Automotive", "Music", "Home", "Movies", "Health", "Sports", "Garden", "Baby", "Kids", "Toys", "Computers", "Clothing", "Outdoors", "Shoes", "Jewelery", "Industrial", "Electronics", "Tools", "Grocery", "Beauty", "Books"];
/**
 * Generate a random department.
 *
 * @category commerce
 *
 * @example
 *
 * randDepartment()
 *
 * @example
 *
 * randDepartment({ length: 10 })
 *
 */

function randDepartment(options) {
  return fake(data$1m, options);
}

var data$1l = ["Southwest", "North", "Northeast", "Northwest", "South", "West", "East", "Southeast"];
/**
 * Generate a random direction.
 *
 * @category address
 *
 * @example
 *
 * randDirection()
 *
 * @example
 *
 * randDirection({ length: 10 })
 *
 */

function randDirection(options) {
  return fake(data$1l, options);
}

var data$1k = ["Jack Russell Terrier", "Beauceron", "Denmark Feist", "Affenpinscher", "Kishu", "Boykin Spaniel", "English Toy Terrier", "Alaskan Malamute", "English Mastiff", "Maltese", "Croatian Sheepdog", "Garafian Shepherd", "Giant Schnauzer", "Austrian Black and Tan Hound", "Basset Fauve de Bretagne", "Pomeranian", "Nova Scotia Duck Tolling Retriever", "Hygen Hound", "Golden Retriever", "Doberman Pinscher", "French Poodle", "Siberian Husky", "Cocker Spaniel"];
/**
 * Generate a random dog.
 *
 * @category animals
 *
 * @example
 *
 * randDog()
 *
 * @example
 *
 * randDog({ length: 10 })
 *
 */

function randDog(options) {
  return fake(data$1k, options);
}

var data$1j = ["org", "biz", "com", "net", "name", "info", "io", "dev"];
/**
 * Generate a random domain suffix.
 *
 * @category Internet
 *
 * @example
 *
 * randDomainSuffix()
 *
 * @example
 *
 * randDomainSuffix({ length: 10 })
 *
 */

function randDomainSuffix(options) {
  return fake(data$1j, options);
}

var data$1i = ["est", "voluptatem", "non", "aut", "aliquid", "quaerat", "quos", "vel", "tenetur", "consectetur", "ipsum", "voluptate", "numquam", "nulla", "asperiores", "in", "laborum", "quas", "et", "ullam", "consequuntur", "enim", "dicta", "quia", "facilis", "voluptatibus", "at", "hic", "sunt", "excepturi", "maiores", "vitae", "fugit", "possimus", "unde", "repellat", "sit", "necessitatibus", "nemo", "qui", "exercitationem", "dolores", "esse", "reiciendis", "nihil", "commodi", "id", "sequi", "consequatur", "occaecati", "deserunt", "quae", "eos", "sapiente", "fugiat", "neque", "quasi", "nostrum", "magnam", "sed", "omnis", "doloribus", "error", "ducimus", "rerum", "beatae", "cupiditate", "blanditiis", "labore"];

function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
/**
 * Generate a random word.
 *
 * @category text
 *
 * @example
 *
 * randWord()
 *
 * @example
 *
 * randWord({ capitalize: true }) // default is false
 *
 * @example
 *
 * randWord({ length: 10 })
 *
 */


function randWord(options) {
  const factory = () => {
    let word = randElement(data$1i);

    if (options != null && options.capitalize) {
      word = capitalizeFirstLetter(word);
    }

    return word;
  };

  return fake(factory, options);
}
/**
 * Generate a random domain name.
 *
 * @category Internet
 *
 * @example
 *
 * randDomainName()
 *
 * @example
 *
 * randDomainName({ length: 10 })
 *
 */


function randDomainName(options) {
  return fake(() => `${randWord()}.${randDomainSuffix()}`, options);
}

var data$1h = ["Amaretto Sour", "Aviation", "Cocktail", "Gin", "Liqueur", "Bellini", "Brandy", "Black Russian", "Bourbon", "Coffee-flavored liqueur", "Coffee liqueur", "Cranberry Vodka", "Creme de Cacao", "Creme de Cassis", "Creme de Menthe", "Creme de Noyaux", "Bloody Mary", "Boulevardier", "Bronx Cocktail", "Clover Club", "Cosmopolitan", "Cuba Libre", "Daiquiri", "Dark and Stormy", "French 75", "Gin and Tonic", "Godfather", "B52", "Greyhound", "Harvey Wallbanger", "Irish Coffee", "Jack Rose", "Kamikaze", "Martini", "Martini Bianco", "Long Island", "Long Island Ice Tea", "Mai Tai", "Margarita", "Mimosa", "Mint Julep", "Negroni", "Mojito", "Still Water", "Sprinkled Water", "White Lady", "Negroni", "Champagne", "Red Wine", "White Wine", "Rum", "Rum and Coke", "Rum Punch", "Pina Colada", "Sangria", "Sazerac", "Tequila", "Tequila Sunrise", "Zombie", "Thai Spring Mojito", "Thai Basil Martini", "Screwdriver", "Raspberry Lemon Drop", "Orange Soda", "Pineapple Gingerale", "Pomegranate Cranberry", "Natural Vanilla Syrup", "Orange Liqueur", "Peach Schnapps", "Peppermint Schnapps", "Pineapple Juice", "Pineapple Soda", "Passion Fruit Pucker"];
/**
 * Generate a random drink.
 *
 * @category drinks
 *
 * @example
 *
 * randDrinks()
 *
 * @example
 *
 * randDrinks({ length: 10 })
 *
 */

function randDrinks(options) {
  return fake(data$1h, options);
}

var data$1g = ["aim", "alice", "aliceadsl", "aol", "arcor", "att", "bellsouth", "bigpond", "bluewin", "blueyonder", "bol", "centurytel", "charter", "chello", "club-internet", "comcast", "earthlink", "facebook", "free", "freenet", "frontiernet", "gmail", "gmx", "googlemail", "hetnet", "home", "hotmail", "ig", "juno", "laposte", "libero", "live", "mac", "mail", "me", "msn", "neuf", "ntlworld", "optonline", "optusnet", "orange", "outlook", "planet", "qq", "rambler", "rediffmail", "rocketmail", "sbcglobal", "sfr", "shaw", "sky", "skynet", "sympatico", "t-online", "telenet", "terra", "tin", "tiscali", "unaref", "uol", "verizon", "virgilio", "voila", "wanadoo", "web", "windstream", "yahoo", "yandex", "zonnet"];
/**
 * Generate a random email provider.
 *
 * @category Internet
 *
 * @example
 *
 * randEmailProvider()
 *
 * @example
 *
 * randEmailProvider({ length: 10 })
 *
 */

function randEmailProvider(options) {
  return fake(data$1g, options);
}

var data$1f = {
  withAccents: {
    male: ["Adrián", "Ægir", "Álvaro", "André", "Andrés", "Árni", "Asbjørn", "Björn", "César", "Daníel", "Davíð", "Emílio", "Fañch", "François", "František", "Gísli", "Götz", "Guðjón", "Guðmundur", "Günter", "Halldór", "Hans-Jörg", "Hans-Jürgen", "Hüseyin", "Iñaki", "János", "Jesús", "Jiří", "Jóhann", "Jóhannes", "Jokūbas", "Jón", "José", "Jörn", "Julião", "Jürgen", "Kristján", "Maël", "Magnús", "Mathéo", "Mátyás", "Michał", "Noël", "Nuñez", "Ólafur", "Óscar", "Øyvind", "Páll", "Paweł", "Pétur", "Ramón", "Raúl", "René", "Ruairí", "Rubén", "Seán", "Sérgio", "Sigurður", "Sönke", "Stefán", "Tomáš", "Þorsteinn"],
    female: ["Ædel", "Agnès", "Alícia", "Änne", "Antónia", "Ásta", "Auður", "Cäcilia", "Chloë", "Claúdia", "Dörte", "Elín", "Elísabet", "Eliška", "Františka", "Glória", "Grażyna", "Guðbjörg", "Guðný", "Guðrún", "Henriëtte", "Ingibjörg", "Íris", "Jóhanna", "Jóna", "Júlia", "Käte", "Katrín", "Kolbrún", "Kristín", "KŠthe", "Letícia", "Lídia", "Lúcia", "Małgorzata", "Margrét", "María", "Mónica", "Natália", "Ólöf", "Patrícia", "Ragnheiður", "Renée", "Ružena", "Siân", "Sigríður", "Sigrún", "Sílvia", "Sørina", "Věra", "Virgínia", "Zoë", "Þóra", "Þórunn"]
  },
  withoutAccents: {
    male: ["Abdul", "Abdullahi", "Abubakar", "Adam", "Adamu", "Adiy", "Ahmad", "Ajay", "Akira", "Alan", "Alberto", "Alejandro", "Aleksander", "Aleksandr", "Aleksey", "Alex", "Alexander", "Alexey", "Ali", "Aliyu", "Aminu", "Amit", "Amiyr", "Amiyt", "Amnuai", "Amphon", "Anah", "Anan", "Andreas", "Andrew", "Andrey", "Andri", "Andries", "Andrzej", "Anil", "Anthony", "Anton", "Antonio", "Arnar", "Artur", "Artyom", "Arun", "Ashok", "Atli", "Avraham", "Bartosz", "Bello", "Bernd", "Bin", "Birgir", "Bjarni", "Blessing", "Bongani", "Brian", "Bunmi", "Carlos", "Carol", "Chan", "Chao", "Charles", "Charoen", "Chen", "Cheng", "Christian", "Christopher", "Colin", "Daniel", "Daniyel", "Dariusz", "David", "Denis", "Dennis", "Diego", "Dieter", "Dilip", "Dinesh", "Dmitriy", "Dmitry", "Einar", "Eliyahu", "Emmanuel", "Evgeniy", "Fernando", "Fran", "Francis", "Francisco", "Francisco-Javier", "Frank", "Franz", "Gang", "Gareth", "Gary", "George", "Gerhard", "Graham", "Grzegorz", "Gunnar", "Guy", "Haim", "Haiyan", "Hans", "Hans-Ulrich", "Haruna", "Hassan", "Heike", "Heinz", "Helgi", "Helmut", "Hendrik", "Herbert", "Hideo", "Hiromi", "Hiroshi", "Hong", "Horst", "Hui", "Ian", "Ibrahim", "Idris", "Igor", "Ilya", "Isa", "Isaac", "Isah", "Ivan", "Jabulani", "Jacek", "Jacobus", "Jakub", "James", "Jan", "Janusz", "Javier", "Jean", "Jerzy", "Jesus", "Jason", "Jianguo", "Jianhua", "Jianjun", "Jianping", "Jin", "Joan", "Johan", "Johannes", "John", "Jonathan", "Jorge", "Jose", "Jose-Antonio", "Jose-Luis", "Jose-Manuel", "Jose-Maria", "Josef", "Joseph", "Joyce", "Juan", "Kabiru", "Kai", "Kamil", "Karen", "Karl", "Karl-Heinz", "Katsumi", "Kazuo", "Kelvin", "Kenji", "Kenneth", "Kevin", "Kiran", "Kirill", "Kiyoshi", "Kjartan", "Klaus", "Ko", "Koichi", "Koji", "Konstantin", "Koshi", "Krishna", "Kristinn", "Krzysztof", "Kun", "Lakshmi", "Lan", "Laxmi", "Lei", "Li", "Lihua", "Lijun", "Lilian", "Lin", "Ling", "Liping", "Liyor", "Luis", "Lukasz", "Maciej", "Mahmood", "Maksim", "Manfred", "Manoj", "Manuel", "Marcin", "Mardkhay", "Marek", "Mariusz", "Mark", "Martin", "Masami", "Masao", "Mateusz", "Matt", "Matthew", "Meiyr", "Michael", "Michal", "Miguel", "Miguel-Angel", "Mikhail", "Min", "Ming", "Mitsuo", "Miykhael", "Miykhal", "Mo", "Mohamed", "Mohammad", "Mohammed", "Mohan", "Moses", "Moshe", "Mpho", "Muhammad", "Muhammed", "Mukesh", "Musa", "Narong", "Nathan", "Nicola", "Nikita", "Nikolay", "Ning", "Nkosinathi", "Noam", "Oleg", "Omer", "Otieno", "Pablo", "Patrick", "Paul", "Pavel", "Pawel", "Pedro", "Peng", "Peter", "Petrus", "Philip", "Pieter", "Ping", "Piotr", "Prasit", "Prasoet", "Pricha", "Pushpa", "Qiang", "Qing", "Radha", "Rafael", "Ragnar", "Raj", "Rajendra", "Rajesh", "Raju", "Rakesh", "Ram", "Ramesh", "Raphael", "Rattana", "Ravi", "Richard", "Robert", "Roman", "Rong", "Roy", "Ryan", "Salisu", "Saman", "Samran", "Samuel", "Sani", "Sanjay", "Santosh", "Sam", "Sammy", "Sawat", "Sebastian", "Sergey", "Sergio", "Shankar", "Shay", "Shigeru", "Shimon", "Shlomo", "Shoji", "Sibusiso", "Simon", "Sipho", "Sombat", "Sombun", "Somchai", "Somchit", "Somkhit", "Somkiat", "Sommai", "Somnuek", "Somphon", "Somphong", "Somsak", "Sri", "Stefan", "Stephen", "Steve", "Steven", "Suman", "Sunday", "Sunil", "Sunthon", "Suresh", "Sushila", "Suwit", "Sveinn", "Tadashi", "Takashi", "Takeshi", "Tal", "Tebogo", "Thabo", "Thawi", "Themba", "Thomas", "Thulani", "Tomasz", "Toshio", "Udom", "Umar", "Uriy", "Usman", "Uwe", "Victor", "Vijay", "Viktor", "Vincent", "Vinod", "Vladimir", "Walter", "Wanchai", "Waraphon", "Wei", "Werner", "Wichai", "Wichian", "Willem", "William", "Winai", "Wirat", "Wirot", "Wojciech", "Wolfgang", "Xiang", "Xiaohong", "Xiaoli", "Xiaoping", "Xiaoyan", "Xin", "Xolani", "Yaakv", "Yahaya", "Yakubu", "Yan", "Yasuo", "Yhudah", "Ying", "Yisrael", "Yong", "Yosef", "Yoshie", "Yoshimi", "Yoshio", "Yu", "Yue", "Yukio", "Yun", "Yuriy", "Yusuf", "Yuval", "Zbigniew", "Zhen", "Zhiqiang"],
    female: ["Agata", "Agnieszka", "Aisha", "Akira", "Aleksandra", "Alina", "Alyona", "Amina", "Amnuai", "Ana", "Ana-Maria", "Anah", "Anan", "Anastasiya", "Andrea", "Angela", "Anita", "Ann", "Anna", "Anong", "Antonia", "Asha", "Barbara", "Beata", "Berglind", "Bin", "Birgit", "Birna", "Blessing", "Brigitte", "Bunmi", "Busisiwe", "Carmen", "Carol", "Caroline", "Catherine", "Chan", "Chanah", "Chao", "Charoen", "Chayah", "Chen", "Cheng", "Christa", "Christine", "Claire", "Claudia", "Cristina", "Darya", "Dolores", "Dorota", "Edda", "Ekaterina", "Elena", "Elisabeth", "Elizabeth", "Elke", "Emiko", "Emma", "Erika", "Erla", "Erna", "Ester", "Esther", "Eunice", "Eva", "Eugenia", "Ewa", "Faith", "Fatima", "Fiona", "Fran", "Francisca", "Fumiko", "Galina", "Gabra", "Gisela", "Gita", "Grace", "Hadiza", "Haiyan", "Hanna", "Haruna", "Hauwa", "Heike", "Helen", "Helga", "Hildur", "Hiroko", "Hiromi", "Hisako", "Hong", "Hui", "Hulda", "Inga", "Ingrid", "Irina", "Isa", "Isabel", "Isah", "Iwona", "Jackline", "Jan", "Jane", "Janet", "Jean", "Jennifer", "Jianhua", "Jianping", "Jin", "Joan", "Joanna", "Johanna", "Josefa", "Joy", "Joyce", "Juan", "Julie", "Justyna", "Kai", "Kanchana", "Karen", "Karin", "Karolina", "Kasia", "Katarzyna", "Katsumi", "Keiko", "Kiran", "Kiyoko", "Kristina", "Kseniya", "Kun", "Lakshmi", "Lalita", "Lan", "Latda", "Laura", "Laxmi", "Leah", "Lei", "Li", "Lihua", "Lijun", "Lilian", "Lilja", "Lin", "Linda", "Lindiwe", "Ling", "Liping", "Lisa", "Lucia", "Lucy", "Lyubov", "Lyudmila", "Magda", "Magdalena", "Mali", "Manju", "Margaret", "Maria", "Maria-Isabel", "Maria-Jose", "Maria-Pilar", "Marina", "Mariya", "Marta", "Martha", "Mary", "Maryam", "Masako", "Masami", "Mei", "Mercy", "Michal", "Michiko", "Mieko", "Min", "Mina", "Ming", "Miriam", "Miyoko", "Mo", "Monika", "Mpho", "Na", "Nadezhda", "Nan", "Nancy", "Natalya", "Ngozi", "Nicola", "Ning", "Nittaya", "Noam", "Nobuko", "Nokuthula", "Nonhlanhla", "Noriko", "Nushi", "Olga", "Omer", "Patricia", "Paula", "Paulina", "Peng", "Petra", "Phonthip", "Pilar", "Ping", "Prani", "Purity", "Pushpa", "Qing", "Rachel", "Radha", "Rattana", "Rebecca", "Reiko", "Rekha", "Renate", "Rita", "Rong", "Rosa", "Rose", "Rut", "Ruth", "Ryoko", "Sabine", "Sachiko", "Samran", "Santosh", "Sara", "Sarah", "Sam", "Sammy", "Sawat", "Shanti", "Sharon", "Shay", "Shizuko", "Shoshanah", "Sibongile", "Sita", "Sombat", "Sombun", "Somchit", "Somkhit", "Sommai", "Somnuek", "Somphon", "Somphong", "Sri", "Steinunn", "Sukanya", "Suman", "Sunday", "Sunita", "Suphaphon", "Susan", "Susanne", "Sushila", "Svetlana", "Takako", "Tamar", "Tatyana", "Tal", "Tebogo", "Teruko", "Thawi", "Tomiko", "Toshiko", "Unnur", "Urai", "Urmila", "Ursula", "Usha", "Valentina", "Victoria", "Wanjiru", "Wanphen", "Watsana", "Wei", "Wilai", "Xiang", "Xiaohong", "Xiaoli", "Xiaoping", "Xiaoyan", "Xin", "Yael", "Yan", "Yasuko", "Yelena", "Yhudiyt", "Ying", "Yoko", "Yong", "Yoshie", "Yoshiko", "Yoshimi", "Yu", "Yue", "Yuko", "Yuliya", "Yun", "Yuval", "Zainab", "Zandile", "Zanele", "Zhen"]
  }
};
/**
 * Generate a random first name.
 *
 * @category person
 *
 * @example
 *
 * randFirstName()
 *
 * @example
 *
 * randFirstName({ withAccents: true })
 *
 * @example
 *
 * randFirstName({ gender: 'female' }) // Emma
 *
 * @example
 *
 * randFirstName({ length: 10 })
 *
 */

function randFirstName(options) {
  var _options$withAccents, _options$gender;

  const withAccents = (_options$withAccents = options == null ? void 0 : options.withAccents) != null ? _options$withAccents : false;
  const gender = (_options$gender = options == null ? void 0 : options.gender) != null ? _options$gender : rand(['male', 'female']);
  const locale = options == null ? void 0 : options.locale;
  const names = withAccents ? locale ? locale == null ? void 0 : locale.withAccents[gender] : data$1f.withAccents[gender] : locale ? locale == null ? void 0 : locale.withoutAccents[gender] : data$1f.withoutAccents[gender];
  return fake(names, options);
}

var data$1e = {
  withAccents: ["Æbelø", "Æbeltoft", "Ágústsdóttir", "Ágústsson", "Álvarez", "Árnadóttir", "Árnason", "Ásgeirsdóttir", "Ãshaikh", "Beneš", "Benešová", "Baldursdóttir", "Birgisdóttir", "Bjarnadóttir", "Björnsdóttir", "Björnsson", "Böttcher", "Černá", "Černý", "Chávez", "Ðekić", "Díaz", "Ðorðić", "Dvořák", "Dvořáková", "Einarsdóttir", "Fernández", "Fialová", "Förster", "Friðriksson", "Fröhlich", "García", "Gísladóttir", "Gíslason", "Göbel", "Gómez", "Groß", "Gunnarsdóttir", "Guðjónsdóttir", "Guðjónsson", "Guðmundsdóttir", "Guðmundsson", "Günther", "Halldórsdóttir", "Halldórsson", "Gutiérrez", "Guzmán", "Hájek", "Haraldsdóttir", "Harðardóttir", "Harðarson", "Helgadóttir", "Hernández", "Hauksdóttir", "Horák", "Horáková", "Jabłoński", "Jäger", "Jasiński", "Jiménez", "Jóhannesdóttir", "Jóhannesson", "Jóhannsdóttir", "Jóhannsson", "Jónasdóttir", "Jónasson", "Jónsdóttir", "Jónsson", "Kamiński", "Karlsdóttir", "Kjartansdóttir", "Köhler", "König", "Kozłowski", "Králová", "Krejčí", "Kristinsdóttir", "Kristjánsdóttir", "Kristjánsson", "Krüger", "Kučera", "Kučerová", "Łapiński", "Löffler", "López", "Łuczak", "Łukaszewski", "Magnúsdóttir", "Magnússon", "Marková", "Martínez", "Meißner", "Méndez", "Möller", "Müller", "Muñoz", "Novák", "Nováková", "Novotná", "Novotný", "Nuñez", "Núñez", "Ødegård", "Őhlschlägerová", "Ólafsdóttir", "Ólafsson", "Őllösová", "Olszewski", "Őri", "Őrségi-Zölderdő", "Óskarsdóttir", "Óskarsson", "Øvergård", "Őzse", "Pálsdóttir", "Pálsson", "Pawłowski", "Peña", "Pérez", "Pétursdóttir", "Pétursson", "Pokorná", "Pokorný", "Pospíšil", "Pospíšilová", "Procházka", "Procházková", "Ragnarsdóttir", "Ramírez", "Ríos", "Rodríguez", "Sánchez", "Schäfer", "Schröder", "Schütz", "Sigurðardóttir", "Sigurðsson", "Sigurjónsdóttir", "Sigurjónsson", "Sokołowski", "Stefánsdóttir", "Stefánsson", "Sveinsdóttir", "Svobodová", "Szczepański", "Szymański", "Urbański", "Ūsas", "Ūžien", "Vásquez", "Veselá", "Veselý", "Weiß", "Żak", "Žáková", "Zemanová", "Zieliński", "Žukauskas", "Žukauskienė", "Þórðardóttir", "Þórðarson", "Þorsteinsdóttir", "Þorsteinsson"],
  withoutAccents: ["Abdi", "Abdullahi", "Abe", "Abubakar", "Achieng", "Adamczyk", "Adamu", "Adan", "Adebayo", "Adhiambo", "Adri", "Agbaria", "Aguilar", "Ahmad", "Ahmed", "Akinyi", "Akpan", "Ali", "Aliev", "Aliyu", "Allen", "Alonso", "Alvarez", "Amadi", "Aminu", "Andreev", "Andreeva", "Ansari", "Anyango", "Aoki", "Arai", "Arnarson", "Ashknaziy", "Atieno", "Attias", "Audu", "Avraham", "Ayutthaya", "Azulay", "Baba", "Bai", "Bailey", "Baker", "Bakker", "Bala", "Baldursson", "Baloyi", "Baran", "Barasa", "Barman", "Bauer", "Becker", "Begam", "Begum", "Behera", "Bekher", "Bello", "Bennett", "Ber", "Bevan", "Bibi", "Birgisson", "Biswas", "Bitton", "Bjarnason", "Blanco", "Blom", "Borkowski", "Bos", "Botha", "Bowen", "Braun", "Brouwer", "Brown", "Bunma", "Bunmi", "Bunsi", "Buthelezi", "Cai", "Cano", "Cao", "Carter", "Castillo", "Castro", "Cele", "Ceng", "Chaichana", "Chand", "Chanthara", "Chauke", "Chebet", "Chen", "Cheng", "Chepkemoi", "Cherinsuk", "Cheruiyot", "Chided", "Chmielewski", "Chukwu", "Clark", "Clarke", "Coetzee", "Cohen", "Collins", "Cook", "Cooper", "Cortes", "Cruz", "Cui", "Czarnecki", "Dahan", "Dai", "Das", "Dauda", "David", "Davies", "Davis", "Dayan", "De-Bruijn", "De-Graaf", "De-Groot", "De-Jong", "Dekker", "Delgado", "Deng", "Devi", "Diaz", "Dijkstra", "Ding", "Dlamini", "Dominguez", "Dong", "Du-Plessis", "Dube", "Duda", "Dudek", "Dumont", "Edwards", "Egorov", "Egorova", "Einarsson", "Elbaz", "Eliyahu", "Ellis", "Emmanuel", "Endo", "Espinoza", "Esteban", "Evans", "Eze", "Fan", "Fang", "Feldman", "Feng", "Fernandez", "Fiala", "Fischer", "Flores", "Friedman", "Frolova", "Fu", "Fuchs", "Fujii", "Fujita", "Fukuda", "Gaby", "Gao", "Garba", "Garcia", "Garrido", "Garza", "Ghosh", "Gil", "Golan", "Goldstein", "Gomez", "Gonzales", "Gonzalez", "Goto", "Govender", "Grabowski", "Green", "Greenberg", "Griffiths", "Gu", "Guerrero", "Gumede", "Gunnarsson", "Guo", "Gupta", "Gutierrez", "Hahn", "Hall", "Han", "Haraldsson", "Harle", "Harle-Cowan", "Harris", "Harrison", "Hartmann", "Haruna", "Hasegawa", "Hashimoto", "Hasna", "Hassan", "Hauksson", "Hayashi", "He", "Helgason", "Hen", "Hendriks", "Herbulot", "Hernandez", "Herrera", "Herrmann", "Hill", "Hoekstra", "Hoffmann", "Hofmann", "Hongthong", "Hopkins", "Howells", "Hu", "Huang", "Huber", "Hughes", "Huisman", "Hussein", "Ibrahim", "Idris", "Iglesias", "Igwe", "Ikeda", "Inoue", "Isa", "Isaac", "Isah", "Ishii", "Ishikawa", "Ito", "Ivanov", "Ivanova", "Jabarin", "Jackson", "Jacobs", "Jadhav", "Jakubowski", "James", "Jankowski", "Jansen", "Janssen", "Jaworski", "Jenkins", "Jia", "Jiang", "Jimenez", "Jin", "John", "Johnson", "Jones", "Joseph", "Juma", "Jung", "Kaczmarek", "Kaiser", "Kamau", "Karanja", "Kariuki", "Karlsson", "Kato", "Katz", "Kaur", "Keller", "Khan", "Khatib", "Khatoon", "Khatun", "Khoury", "Khoza", "Khumalo", "Kibet", "Kikuchi", "Kim", "Kimani", "Kimura", "King", "Kjartansson", "Klein", "Kobayashi", "Koch", "Koech", "Kok", "Kondo", "Kongkaeo", "Koster", "Kovalenko", "Kowalczyk", "Kowalski", "Kozlov", "Kozlova", "Krause", "Krawczyk", "Kristinsson", "Kubiak", "Kucharski", "Kuipers", "Kumar", "Kumari", "Kuznetsov", "Kuznetsova", "Kwiatkowski", "Lal", "Lang", "Langat", "Lange", "Lavyan", "Lawal", "Lebedeva", "Lee", "Lehmann", "Levy", "Lewandowski", "Lewis", "Li", "Liang", "Liao", "Lim", "Lin", "Lis", "Liu", "Llewellyn", "Lloyd", "Lopez", "Lozano", "Lu", "Luo", "Ma", "Maas", "Mabaso", "Macharia", "Maciejewski", "Maeda", "Magomedov", "Mahagna", "Mahato", "Mahlangu", "Mahto", "Maier", "Maina", "Majewski", "Makarov", "Makarova", "Malinowski", "Malkah", "Maluleke", "Mandal", "Marciniak", "Marek", "Marin", "Martin", "Martinez", "Masarweh", "Maseko", "Mathebula", "Matsumoto", "Matthews", "Mayer", "Mazibuko", "Mazur", "Mazurek", "Mbatha", "Medina", "Meier", "Meijer", "Mendoza", "Meng", "Meyer", "Mhamid", "Mhlongo", "Michalak", "Michalski", "Mikhaylov", "Mikhaylova", "Mishra", "Mitchell", "Mizrahi", "Mkhize", "Mofokeng", "Mohamed", "Mohammed", "Mokoena", "Molefe", "Molina", "Mondal", "Moore", "Mor", "Morales", "Moreno", "Morgan", "Mori", "Morozov", "Morozova", "Morris", "Moshe", "Mthembu", "Mthethwa", "Mtshali", "Muhammad", "Muhammadu", "Muhammed", "Mulder", "Murakami", "Musa", "Mustapha", "Muthoni", "Mutua", "Mutuku", "Mwangi", "Naidoo", "Nakajima", "Nakamura", "Nakano", "Navarro", "Nayak", "Ndlovu", "Nel", "Neumann", "Ngcobo", "Ngobeni", "Ngubane", "Nguyen", "Ngwenya", "Nikitina", "Nikolaev", "Nikolaeva", "Njeri", "Njoroge", "Njuguna", "Nkosi", "Novikov", "Novikova", "Nowak", "Nowakowski", "Nowicki", "Ntuli", "Nxumalo", "Nyambura", "Oakley", "Ochieng", "Odhiambo", "Ogawa", "Ohana", "Ohayon", "Ojo", "Okada", "Okafor", "Okeke", "Okon", "Okoro", "Okoth", "Omar", "Omer", "Omondi", "Ono", "Onyango", "Ortega", "Ortiz", "Ostrowski", "Ota", "Otieno", "Ouma", "Owen", "Owino", "Pal", "Pan", "Panya", "Paramar", "Parker", "Parry", "Paswan", "Patel", "Patil", "Pavlov", "Pavlova", "Pawlak", "Peeters", "Peng", "Peretz", "Perez", "Peter", "Peters", "Petrov", "Petrova", "Pfeiffer", "Phillips", "Photsi", "Pietrzak", "Pillay", "Piotrowski", "Popov", "Popova", "Powell", "Prasad", "Pretorius", "Price", "Prieto", "Prins", "Pritchard", "Pugh", "Qiu", "Rabiu", "Radebe", "Ragnarsson", "Ram", "Ramirez", "Ramos", "Rani", "Rathod", "Ray", "Rees", "Ren", "Reuben", "Reyes", "Richards", "Richardson", "Richter", "Rivera", "Roberts", "Robinson", "Rodriguez", "Rogers", "Romanov", "Romanova", "Romero", "Rosenberg", "Rotich", "Rowlands", "Roy", "Rubio", "Ruiz", "Rungrueang", "Rumbelow", "Rutkowski", "Sadowski", "Saeli", "Saelim", "Saengthong", "Saetan", "Saetang", "Saeueng", "Sah", "Saha", "Sahu", "Saidu", "Saito", "Sakai", "Sakamoto", "Salazar", "Salisu", "Samuel", "Sanchez", "Sangthong", "Sani", "Santiago", "Santos", "Sanz", "Sarkar", "Sasaki", "Sato", "Sawicki", "Schmid", "Schmidt", "Schmitt", "Schmitz", "Schneider", "Scholz", "Schouten", "Schulz", "Schulze", "Schwartz", "Schwarz", "Scott", "Segel", "Sekh", "Sergeeva", "Serrano", "Shaikh", "Shalom", "Shapiro", "Sharabi", "Sharma", "Shaw", "Shehu", "Shemesh", "Shevchenko", "Shi", "Shimizu", "Sibiya", "Sichantha", "Sikora", "Simiyu", "Singh", "Sisuk", "Sithole", "Sitwat", "Smee", "Smirnov", "Smirnova", "Smit", "Smith", "Smits", "Sokolov", "Sokolova", "Sombun", "Song", "Soto", "Smoakley", "Starr", "Stepanov", "Stepanova", "Su", "Suad", "Suarez", "Suissa", "Sukkasem", "Sulaiman", "Suleiman", "Sun", "Sunday", "Suwan", "Suzuki", "Sveinsson", "Svoboda", "Szewczyk", "Takahashi", "Takeuchi", "Tal", "Tan", "Tanaka", "Tang", "Taylor", "Thakur", "Thomas", "Thompson", "Thongdi", "Thongkham", "Thongsuk", "Tian", "Tomaszewski", "Torres", "Tshabalala", "Turner", "Udo", "Ueda", "Umar", "Umaru", "Usman", "Vaknin", "Valdez", "Van-Beek", "Van-Dam", "Van-den-Berg", "Van-der-Heijden", "Van-der-Linden", "Van-Dijk", "Vargas", "Vasilev", "Vasileva", "Vazquez", "Vega", "Venter", "Verhoeven", "Vermeulen", "Visser", "Volkov", "Volkova", "Vos", "Wafula", "Wagner", "Wairimu", "Walczak", "Walker", "Walter", "Walters", "Wambua", "Wambui", "Wang", "Wangui", "Wanjala", "Wanjiku", "Ward", "Watanabe", "Watkins", "Watson", "Weber", "Wei", "Wekesa", "Wen", "Werner", "White", "Wieczorek", "Wilk", "Willems", "Williams", "Wilson", "Witkowski", "Wojciechowski", "Wolf", "Wood", "Wright", "Wu", "Xiao", "Xie", "Xu", "Yaakv", "Yadav", "Yahaya", "Yakovleva", "Yakubu", "Yamada", "Yamaguchi", "Yamamoto", "Yamashita", "Yamazaki", "Yan", "Yang", "Yao", "Ye", "Yin", "Yosef", "Yoshida", "Young", "Yu", "Yuan", "Yusuf", "Zajac", "Zakharov", "Zakharova", "Zalewski", "Zawadzki", "Zaytseva", "Zhang", "Zhao", "Zheng", "Zhong", "Zhou", "Zhu", "Zimmermann", "Zoabi", "Zulu", "Zwane"]
};
/**
 * Generate a random last name.
 *
 * @category person
 *
 * @example
 *
 * randLastName()
 *
 * @example
 *
 * randLastName({ withAccents: false })
 *
 * @example
 *
 * randLastName({ length: 10 })
 *
 */

function randLastName(options) {
  var _options$withAccents;

  const withAccents = (_options$withAccents = options == null ? void 0 : options.withAccents) != null ? _options$withAccents : randBoolean();
  const names = withAccents ? data$1e['withAccents'] : data$1e['withoutAccents'];
  return fake(names, options);
}

function randFormattedName(options) {
  var _options$firstName, _options$lastName;

  let separator = '';
  const firstName = (_options$firstName = options == null ? void 0 : options.firstName) != null ? _options$firstName : randFirstName({
    withAccents: false
  });
  const lastName = (_options$lastName = options == null ? void 0 : options.lastName) != null ? _options$lastName : randLastName({
    withAccents: false
  });

  if (!(options != null && options.nameSeparator)) {
    separator = fake(['.', '-', '_', '+', '']);
  } else if (options.nameSeparator !== 'none') {
    separator = options.nameSeparator;
  }

  let name = `${firstName} ${lastName}`.replace(' ', separator);

  if (randBoolean()) {
    name += randNumber({
      min: 1,
      max: 1000
    });
  }

  return name.toLowerCase();
}
/**
 * Generate a random email.
 *
 * @category Person, User
 *
 * @example
 *
 * randEmail()
 *
 * @example
 *
 * randEmail({ length: 10 })
 *
 * @example
 *
 * randEmail({ firstName: 'Netanel' })
 *
 * @example
 *
 * randEmail({ lastName: 'Basal' })
 *
 * @example
 *
 * randEmail({ nameSeparator: '.' })
 *
 * @example
 *
 * randEmail({ provider: 'gmail' })
 *
 * @example
 *
 * randEmail({ suffix: 'com' })
 *
 *
 */


function randEmail(options) {
  const factory = () => {
    const emailProvider = (options == null ? void 0 : options.provider) || randEmailProvider();
    const formattedName = randFormattedName(options);
    const emailSuffix = (options == null ? void 0 : options.suffix) || randDomainSuffix();
    return `${formattedName}@${emailProvider}.${emailSuffix}`;
  };

  return fake(factory, options);
}

var data$1d = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😶‍🌫️", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️‍🔥", "❤️‍🩹", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵", "🙍", "🙍‍♂️", "🙍‍♀️", "🙎", "🙎‍♂️", "🙎‍♀️", "🙅", "🙅‍♂️", "🙅‍♀️", "🙆", "🙆‍♂️", "🙆‍♀️", "💁", "💁‍♂️", "💁‍♀️", "🙋", "🙋‍♂️", "🙋‍♀️", "🧏", "🧏‍♂️", "🧏‍♀️", "🙇", "🙇‍♂️", "🙇‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "🤷", "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", "👨‍🏫", "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", "👮", "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", "💂", "💂‍♂️", "💂‍♀️", "🥷", "👷", "👷‍♂️", "👷‍♀️", "🤴", "👸", "👳", "👳‍♂️", "👳‍♀️", "👲", "🧕", "🤵", "🤵‍♂️", "🤵‍♀️", "👰", "👰‍♂️", "👰‍♀️", "🤰", "🤱", "👩‍🍼", "👨‍🍼", "🧑‍🍼", "👼", "🎅", "🤶", "🧑‍🎄", "🦸", "🦸‍♂️", "🦸‍♀️", "🦹", "🦹‍♂️", "🦹‍♀️", "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "🧝", "🧝‍♂️", "🧝‍♀️", "🧞", "🧞‍♂️", "🧞‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "💆", "💆‍♂️", "💆‍♀️", "💇", "💇‍♂️", "💇‍♀️", "🚶", "🚶‍♂️", "🚶‍♀️", "🧍", "🧍‍♂️", "🧍‍♀️", "🧎", "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", "🏃", "🏃‍♂️", "🏃‍♀️", "💃", "🕺", "🕴️", "👯", "👯‍♂️", "👯‍♀️", "🧖", "🧖‍♂️", "🧖‍♀️", "🧗", "🧗‍♂️", "🧗‍♀️", "🤺", "🏇", "⛷️", "🏂", "🏌️", "🏌️‍♂️", "🏌️‍♀️", "🏄", "🏄‍♂️", "🏄‍♀️", "🚣", "🚣‍♂️", "🚣‍♀️", "🏊", "🏊‍♂️", "🏊‍♀️", "⛹️", "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", "🚴", "🚴‍♂️", "🚴‍♀️", "🚵", "🚵‍♂️", "🚵‍♀️", "🤸", "🤸‍♂️", "🤸‍♀️", "🤼", "🤼‍♂️", "🤼‍♀️", "🤽", "🤽‍♂️", "🤽‍♀️", "🤾", "🤾‍♂️", "🤾‍♀️", "🤹", "🤹‍♂️", "🤹‍♀️", "🧘", "🧘‍♂️", "🧘‍♀️", "🛀", "🛌", "🧑‍🤝‍🧑", "👭", "👫", "👬", "💏", "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", "💑", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "👪", "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", "👤", "👥", "🫂", "👣", "🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐕‍🦺", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🐈‍⬛", "🦁", "🐯", "🐅", "🐆", "🐴", "🐎", "🦄", "🦓", "🦌", "🦬", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦒", "🐘", "🦣", "🦏", "🦛", "🐭", "🐁", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦫", "🦔", "🦇", "🐻", "🐻‍❄️", "🐨", "🐼", "🦥", "🦦", "🦨", "🦘", "🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦤", "🪶", "🦩", "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", "🐋", "🐬", "🦭", "🐟", "🐠", "🐡", "🦈", "🐙", "🐚", "🐌", "🦋", "🐛", "🐜", "🐝", "🪲", "🐞", "🦗", "🪳", "🕷️", "🕸️", "🦂", "🦟", "🪰", "🪱", "🦠", "💐", "🌸", "💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🪴", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧋", "🧃", "🧉", "🧊", "🥢", "🍽️", "🍴", "🥄", "🔪", "🏺", "🌍", "🌎", "🌏", "🌐", "🗺️", "🗾", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🪨", "🪵", "🛖", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🛻", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🛼", "🚏", "🛣️", "🛤️", "🛢️", "⛽", "🚨", "🚥", "🚦", "🛑", "🚧", "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🛎️", "🧳", "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "🌡️", "☀️", "🌝", "🌞", "🪐", "⭐", "🌟", "🌠", "🌌", "☁️", "⛅", "⛈️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌀", "🌈", "🌂", "☂️", "☔", "⛱️", "⚡", "❄️", "☃️", "⛄", "☄️", "🔥", "💧", "🌊", "🎃", "🎄", "🎆", "🎇", "🧨", "✨", "🎈", "🎉", "🎊", "🎋", "🎍", "🎎", "🎏", "🎐", "🎑", "🧧", "🎀", "🎁", "🎗️", "🎟️", "🎫", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "⚾", "🥎", "🏀", "🏐", "🏈", "🏉", "🎾", "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎯", "🪀", "🪁", "🎱", "🔮", "🪄", "🧿", "🎮", "🕹️", "🎰", "🎲", "🧩", "🧸", "🪅", "🪆", "♠️", "♥️", "♦️", "♣️", "♟️", "🃏", "🀄", "🎴", "🎭", "🖼️", "🎨", "🧵", "🪡", "🧶", "🪢", "👓", "🕶️", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🛍️", "🎒", "🩴", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "🪖", "⛑️", "📿", "💄", "💍", "💎", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕", "🎼", "🎵", "🎶", "🎙️", "🎚️", "🎛️", "🎤", "🎧", "📻", "🎷", "🪗", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "🪘", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎞️", "📽️", "🎬", "📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯️", "💡", "🔦", "🏮", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", "💰", "🪙", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "💹", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "🔫", "🪃", "🏹", "🛡️", "🪚", "🔧", "🪛", "🔩", "⚙️", "🗜️", "⚖️", "🦯", "🔗", "⛓️", "🪝", "🧰", "🧲", "🪜", "⚗️", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊", "🩹", "🩺", "🚪", "🛗", "🪞", "🪟", "🛏️", "🛋️", "🪑", "🚽", "🪠", "🚿", "🛁", "🪤", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🪣", "🧼", "🪥", "🧽", "🧯", "🛒", "🚬", "⚰️", "🪦", "⚱️", "🗿", "🪧", "🏧", "🚮", "🚰", "♿", "🚹", "🚺", "🚻", "🚼", "🚾", "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔", "🚫", "🚳", "🚭", "🚯", "🚱", "🚷", "📵", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️", "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜", "🔝", "🛐", "⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "☮️", "🕎", "🔯", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎", "🔀", "🔁", "🔂", "▶️", "⏩", "⏭️", "⏯️", "◀️", "⏪", "⏮️", "🔼", "⏫", "🔽", "⏬", "⏸️", "⏹️", "⏺️", "⏏️", "🎦", "🔅", "🔆", "📶", "📳", "📴", "♀️", "♂️", "⚧️", "✖️", "➕", "➖", "➗", "♾️", "‼️", "⁉️", "❓", "❔", "❕", "❗", "〰️", "💱", "💲", "⚕️", "♻️", "⚜️", "🔱", "📛", "🔰", "⭕", "✅", "☑️", "✔️", "❌", "❎", "➰", "➿", "〽️", "✳️", "✴️", "❇️", "©️", "®️", "™️", "#️⃣", "*️⃣", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔠", "🔡", "🔢", "🔣", "🔤", "🅰️", "🆎", "🅱️", "🆑", "🆒", "🆓", "ℹ️", "🆔", "Ⓜ️", "🆕", "🆖", "🅾️", "🆗", "🅿️", "🆘", "🆙", "🆚", "🈁", "🈂️", "🈷️", "🈶", "🈯", "🉐", "🈹", "🈚", "🈲", "🉑", "🈸", "🈴", "🈳", "㊗️", "㊙️", "🈺", "🈵", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜", "◼️", "◻️", "◾", "◽", "▪️", "▫️", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲", "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇨", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷", "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧", "🇧🇩", "🇧🇪", "🇧🇫", "🇧🇬", "🇧🇭", "🇧🇮", "🇧🇯", "🇧🇱", "🇧🇲", "🇧🇳", "🇧🇴", "🇧🇶", "🇧🇷", "🇧🇸", "🇧🇹", "🇧🇻", "🇧🇼", "🇧🇾", "🇧🇿", "🇨🇦", "🇨🇨", "🇨🇩", "🇨🇫", "🇨🇬", "🇨🇭", "🇨🇮", "🇨🇰", "🇨🇱", "🇨🇲", "🇨🇳", "🇨🇴", "🇨🇵", "🇨🇷", "🇨🇺", "🇨🇻", "🇨🇼", "🇨🇽", "🇨🇾", "🇨🇿", "🇩🇪", "🇩🇬", "🇩🇯", "🇩🇰", "🇩🇲", "🇩🇴", "🇩🇿", "🇪🇦", "🇪🇨", "🇪🇪", "🇪🇬", "🇪🇭", "🇪🇷", "🇪🇸", "🇪🇹", "🇪🇺", "🇫🇮", "🇫🇯", "🇫🇰", "🇫🇲", "🇫🇴", "🇫🇷", "🇬🇦", "🇬🇧", "🇬🇩", "🇬🇪", "🇬🇫", "🇬🇬", "🇬🇭", "🇬🇮", "🇬🇱", "🇬🇲", "🇬🇳", "🇬🇵", "🇬🇶", "🇬🇷", "🇬🇸", "🇬🇹", "🇬🇺", "🇬🇼", "🇬🇾", "🇭🇰", "🇭🇲", "🇭🇳", "🇭🇷", "🇭🇹", "🇭🇺", "🇮🇨", "🇮🇩", "🇮🇪", "🇮🇱", "🇮🇲", "🇮🇳", "🇮🇴", "🇮🇶", "🇮🇷", "🇮🇸", "🇮🇹", "🇯🇪", "🇯🇲", "🇯🇴", "🇯🇵", "🇰🇪", "🇰🇬", "🇰🇭", "🇰🇮", "🇰🇲", "🇰🇳", "🇰🇵", "🇰🇷", "🇰🇼", "🇰🇾", "🇰🇿", "🇱🇦", "🇱🇧", "🇱🇨", "🇱🇮", "🇱🇰", "🇱🇷", "🇱🇸", "🇱🇹", "🇱🇺", "🇱🇻", "🇱🇾", "🇲🇦", "🇲🇨", "🇲🇩", "🇲🇪", "🇲🇫", "🇲🇬", "🇲🇭", "🇲🇰", "🇲🇱", "🇲🇲", "🇲🇳", "🇲🇴", "🇲🇵", "🇲🇶", "🇲🇷", "🇲🇸", "🇲🇹", "🇲🇺", "🇲🇻", "🇲🇼", "🇲🇽", "🇲🇾", "🇲🇿", "🇳🇦", "🇳🇨", "🇳🇪", "🇳🇫", "🇳🇬", "🇳🇮", "🇳🇱", "🇳🇴", "🇳🇵", "🇳🇷", "🇳🇺", "🇳🇿", "🇴🇲", "🇵🇦", "🇵🇪", "🇵🇫", "🇵🇬", "🇵🇭", "🇵🇰", "🇵🇱", "🇵🇲", "🇵🇳", "🇵🇷", "🇵🇸", "🇵🇹", "🇵🇼", "🇵🇾", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇸", "🇷🇺", "🇷🇼", "🇸🇦", "🇸🇧", "🇸🇨", "🇸🇩", "🇸🇪", "🇸🇬", "🇸🇭", "🇸🇮", "🇸🇯", "🇸🇰", "🇸🇱", "🇸🇲", "🇸🇳", "🇸🇴", "🇸🇷", "🇸🇸", "🇸🇹", "🇸🇻", "🇸🇽", "🇸🇾", "🇸🇿", "🇹🇦", "🇹🇨", "🇹🇩", "🇹🇫", "🇹🇬", "🇹🇭", "🇹🇯", "🇹🇰", "🇹🇱", "🇹🇲", "🇹🇳", "🇹🇴", "🇹🇷", "🇹🇹", "🇹🇻", "🇹🇼", "🇹🇿", "🇺🇦", "🇺🇬", "🇺🇲", "🇺🇳", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇦", "🇻🇨", "🇻🇪", "🇻🇬", "🇻🇮", "🇻🇳", "🇻🇺", "🇼🇫", "🇼🇸", "🇽🇰", "🇾🇪", "🇾🇹", "🇿🇦", "🇿🇲", "🇿🇼", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "🏴󠁧󠁢󠁷󠁬󠁳󠁿"];
/**
 * Generate a random emoji.
 *
 * @category text
 *
 * @example
 *
 * randEmoji()
 *
 * @example
 *
 * randEmoji({ length: 10 })
 *
 */

function randEmoji(options) {
  return fake(data$1d, options);
}

var data$1c = ["0x958aa9ddbd62f989dec2fd1468bf436aebeb8be6", "0x9a7a3607dc4617deff6d4f9ca5d8c0beba0cffc5", "0xf5dcc57cb74623d2b3bfa6be9d96902f4bacb0b4", "0xfeff5fc09fc64ddde1cb09cdbba9d5aa1bd60028", "0xbf7aa2fdfdc0a971427bc7a815eabe4f37f53c19", "0xba0cbdbda3e1fafd9ba9b1b638d9eea0f8b9d7da", "0xeac476af2cdd3d5bbd723759073db20fe987f7bc", "0x5cef0214f4ebecaeb0a34088f4169dc2dbbf3ddb", "0x3be4ca88dda4aede8b2cf4cdf80878daecfd97d0", "0x5a367fae4dae00e05d6b3ce19d4fadec4da5dffe", "0xbae7b517fdd077edfefffafbd6ffdec6a95413ac", "0xdbcebff49e6f9c8ddb764b5a68b7ba2fdf555c2e", "0xf7aea0ce7ab75bbbeabf83a35b6631124e1b01de", "0xbf53ee26d8dddcccda95b373ad8ce0ebdbb00cfd", "0xd97be3baebea30eedc318e82befd7b451fdca1ce", "0xa69ea3e7eb2937dbc56f1b93dbabbbe7484108d5", "0x46270faac76c1dcb9ea78bfc75d84b82b928962b", "0xeda7bd82aa45cb6f6ddc92ff432b9f1fc970cf6f"];
/**
 * Generate a random ethereum address.
 *
 * @category Finance
 *
 * @example
 *
 * randEthereumAddress()
 *
 * @example
 *
 * randEthereumAddress({ length: 10 })
 *
 */

function randEthereumAddress(options) {
  return fake(data$1c, options);
}

var data$1b = ["aiff", "deb", "utz", "mpeg", "itp", "qxb", "mmf", "fbs", "aam", "link66", "mmr", "clkw", "vis", "eol", "cii", "ini", "uvd", "uvx", "kwd", "gqf", "onetoc2", "man", "z2", "urls", "ots", "cpp", "pub", "csp", "rdf", "list", "sfd-hdstx", "u32", "xhtml", "vxml", "ecma", "swi", "cpt", "gramps", "mb", "pre", "rs", "dts", "nnd", "atom", "pas", "uvvi", "p7b", "ptid", "djvu", "cmp", "msl", "oa2", "flw", "pcurl", "azs", "ssdl", "dotx", "mrcx", "ssf", "m3u", "onetoc", "w3d", "tpt", "mft", "yin", "ogg", "jsonml", "fst", "acc", "x3dvz", "mads", "sxg", "str", "ppsm", "pfx", "vsw", "irp", "meta4", "tex", "clkx", "chrt", "txt", "msf", "wvx", "et3", "bdm", "ods", "3ds", "smi", "skm", "t3", "asm"];
/**
 * Generate a random file ext.
 *
 * @category system
 *
 * @example
 *
 * randFileExt()
 *
 * @example
 *
 * randFileExt({ length: 10 })
 *
 */

function randFileExt(options) {
  return fake(data$1b, options);
}

var data$1a = ["/opt/bin/turn_key_bedfordshire_contingency.mts.acu", "/lib/niches_account_springs.w3d.gtm", "/Applications/plains_fresh_hack.s.onepkg", "/usr/libexec/gold_plum_toys.mbk.xdf", "/net/green_terrace_faroe.csh.wspolicy", "/net/monitor_saint_engineer.mrc.ogv", "/usr/lib/dong.gsf.dxr", "/usr/include/rand_sleek.uvs.qxt", "/usr/buckinghamshire.pdb.so", "/tmp/soft.fxp.dist", "/lost+found/producer_metal_networked.spot.ktz", "/lost+found/gorgeous_plastic.z1.dwf", "/usr/sbin/car.cba.dssc", "/Applications/responsive_mobile.twds.markdown", "/usr/share/copying.scq.teacher", "/bin/neural_net.btif.php", "/lost+found/sudanese.sm.m1v", "/usr/local/bin/compressing_bifurcated.crd.oda", "/etc/mail/uzbekistan_invoice_analyzer.lostxml.xht", "/usr/local/bin/turn_key.uvv.mng", "/usr/share/moldova_loan_administration.pvb.xaml", "/opt/include/frozen.z2.pnm", "/opt/bin/recontextualize_optimization.onetoc.opf", "/rescue/director_grocery.gml.nns", "/opt/bin/adp_keyboard.mcd.prf", "/Users/table_leading.ufd.aas", "/usr/include/avon_best_of_breed.tga.xif", "/etc/periodic/compatible.icm.pcf", "/var/log/withdrawal.sdc.aep", "/var/yp/tasty_silver_idaho.cbr.uvf", "/etc/periodic/web_readiness_international_licensed.lwp.xlf", "/var/spool/future_organic.bpk.wtb", "/home/account_cotton.xap.jpe", "/etc/mail/strategist.ngdat.mcd", "/lib/transmit_awesome.cba.flx", "/home/software.spc.dd2", "/rescue/sticky.asc.ots", "/usr/bin/fish_islands_estates.fdf.aif", "/usr/sbin/optimization_multi_tasking.hvp.mcd", "/etc/ppp/steel.cdf.mp4", "/etc/gorgeous_mews.pml.ppam", "/usr/lib/metrics.smzip.hpid", "/System/hacking.sass.sxg", "/home/user/gloves_grey.ami.svg", "/usr/include/overriding_png.txt.aw", "/lost+found/designer_decentralized.tcl.m4u", "/etc/namedb/de_engineered_bandwidth.igx.avi", "/opt/include/christmas.mp2a.vob", "/usr/X11R6/producer_deliver.txd.rtx", "/net/exploit_smtp.kpxx.qwd", "/private/var/azure_pine_iranian.rif.cst", "/Library/virtual.bdoc.ief", "/usr/bin/drive.hpid.joda", "/etc/namedb/account_parsing.bcpio.mj2", "/lib/configuration_programming.fly.nfo", "/usr/include/maryland_enterprise_wide_tuna.rmvb.mk3d", "/srv/back_end.java.mp3", "/rescue/trace_cotton_synergized.pgm.mpt", "/var/mail/incredible.elc.setreg", "/usr/share/avon_state.onepkg.dwg", "/usr/lib/composite_maryland.md.psd", "/lib/ports_calculating.ogg.wm", "/Network/embrace_interactions_internal.mng.lasxml", "/Users/mobility_avon_internal.mpp.cxx", "/home/smtp_keys_serbian.cbt.f90", "/boot/defaults/index_avon.stl.dxp", "/var/computers_bedfordshire.mp2.ami", "/etc/zimbabwe.html.crx", "/usr/share/alarm.vob.wmls", "/etc/namedb/calculate.cbz.gqs", "/usr/ports/experiences.uvvz.ifm", "/home/user/regional_gold.p8.silo", "/System/avon_representative_bandwidth_monitored.nlu.ez3", "/selinux/gardens.dwg.aiff", "/Library/direct.link66.ktx", "/sys/agp_borders_channels.uu.roa", "/opt/share/computer_indigo.sfs.x3dv", "/srv/payment_invoice.ppd.irm", "/usr/local/bin/indexing_health_tactics.fe_launch.sgl", "/sbin/online_technician.vcd.zmm", "/var/tmp/soap_cambridgeshire_regional.au.xps", "/opt/share/singapore.elc.hps", "/root/solutions_logistical.npx.kmz", "/sbin/system_contingency.xspf.pgp", "/root/dakota.pfa.xps", "/usr/X11R6/savings_expressway.json.uvf", "/usr/ports/intermediate_avon_soft.mml.xfdf", "/etc/namedb/won_fresh.et3.aam", "/dev/hacking.caf.vcd", "/sys/gorgeous_payment.skm.htm", "/Applications/niches.x3d.atom", "/Applications/website.pgp.clkp", "/etc/mail/barbados_azure.gre.php", "/var/tasty.cfs.uvvt", "/usr/src/real.box.gif", "/opt/include/engineer.qxd.xpw", "/opt/sbin/synthesizing_investor.ra.c4d", "/etc/defaults/incredible.spc.edm", "/usr/src/rufiyaa.odp.ace", "/usr/local/bin/tactics_maryland_xml.zip.gram"];
/**
 * Generate a random file path.
 *
 * @category system
 *
 * @example
 *
 * randFilePath()
 *
 * @example
 *
 * randFilePath({ length: 10 })
 *
 */

function randFilePath(options) {
  return fake(data$1a, options);
}

var data$19 = ["model", "x-conference", "x-shader", "video", "application", "message", "multipart", "font", "audio", "image", "chemical", "text"];
/**
 * Generate a random file type.
 *
 * @category system
 *
 * @example
 *
 * randFileType()
 *
 * @example
 *
 * randFileType({ length: 10 })
 *
 */

function randFileType(options) {
  return fake(data$19, options);
}

var data$18 = ["Araucanian herring", "Pacific saury", "Indian oil sardine", "Nile tilapia", "Bombay-duck", "Japanese common catfish", "Whiteleg shrimp", "Haddock", "Chilean jack mackerel", "Pollock", "Southern rough shrimp", "Amur catfish", "Largehead hairtail", "Gazami crab", "Silver carp", "Blue whiting", "Pacific thread herring", "Pacific anchoveta"];
/**
 * Generate a random fish.
 *
 * @category animals
 *
 * @example
 *
 * randFish()
 *
 * @example
 *
 * randFish({ length: 10 })
 *
 */

function randFish(options) {
  return fake(data$18, options);
}
/**
 * Generate a random float.
 *
 * @category general, math
 *
 * @example
 *
 * randFloat()
 *
 * @example
 *
 * randFloat({ length: 10 })
 *
 * @example
 *
 * randFloat({ min: 10, max: 20, fraction: 1 }) // 12.5
 *
 * @example
 *
 * randFloat({ min: 10, max: 20, fraction: 2 }) // 12.52
 */


function randFloat(options) {
  var _options$fraction;

  const o = Object.assign({}, options, {
    fraction: (_options$fraction = options == null ? void 0 : options.fraction) != null ? _options$fraction : 2
  });
  return fake(() => getRandomInRange(o), options);
}

var data$17 = ["Inter", "DM Sans", "Space Mono", "Space Grotesk", "Work Sans", "Syne", "Libre Franklin", "Cormorant", "Fira Sans", "Eczar", "Alegreya Sans", "Alegreya", "Source Sans Pro", "Source Serif Pro", "Roboto", "Roboto Slab", "BioRhyme", "Inknut Antiqua", "Poppins", "Archivo Narrow", "Libre Baskerville", "Playfair Display", "Karla", "Lora", "Proza Libre", "Spectral", "IBM Plex Sans", "Crimson Text", "Montserrat", "Lato", "PT Sans", "PT Serif", "Cardo", "Chivo", "Neuton", "Rubik", "Open Sans", "Inconsolata", "Raleway", "Merriweather"];
/**
 * Generate a random font family.
 *
 * @category code
 *
 * @example
 *
 * randFontFamily()
 *
 * @example
 *
 * randFontFamily({ length: 10 })
 *
 */

function randFontFamily(options) {
  return fake(data$17, options);
}
/**
 * Generate a random font size.
 *
 * @category code
 *
 * @example
 *
 * randFontSize()
 *
 * @example
 *
 * randFontSize({ length: 10 })
 *
 */


function randFontSize(options) {
  return fake(() => {
    var _options$suffix;

    const length = randNumber({
      min: 0,
      max: 2000,
      fraction: 2
    });
    const suffix = (_options$suffix = options == null ? void 0 : options.suffix) != null ? _options$suffix : 'px';
    return `${length}${suffix}`;
  }, options);
}

var data$16 = {
  china: ["Peking roasted duck", "Kung pao chicken", "Sweet and sour pork", "Hot pot", "Dim sum", "Dumplings", "Ma po tofu", "Char siu", "Chicken chow mein", "Beef chow mein", "vegetable chow mein", "Chicken fried rice", "Beef fried rice", "Vegetable fried Rice", "Special fried Rice", "Sichuan pork", "Xiaolongbao", "Zhajiangmian", "Wonton soup", "Sweet and sour pork", "Duck spring Rolls", "Vegetable spring Rolls", "Wonton", "Peking duck", "Lamb hot pot", "Spicy crayfish", "Guilin rice noodles", "Lanzhou hand-pulled noodles", "Steamed crab", "Shredded pork with garlic sauce", "Red braised pork", "Sweet and sour Ribs", "Xinjiang", "Braised pork with vermicelli"],
  italy: ["Butternut squash risotto", "Mushroom risotto", "Beetroot risotto", "Courgette risotto", "Pizza", "Gnocchi", "Spaghetti bolognese", "Spaghetti carbonara", "Pesto alla Genovese", "Beef lasagne", "Vegetable lasagne", "Gelato", "Prosciutto di Parma", "Ribollita", "Bagna cauda", "Polenta", "Tortelli and ravioli", "Focaccia", "Garlic bread", "Arancini", "Il tartufo", "Panzerotto fritto", "Fiorentina", "Minestrone", "Frico", "Arrosticini", "Olive ascolante", "Fritto misto piemontes", "Tiramisù"],
  india: ["Biryani", "Dosa", "Tandoori chicken", "Samosas", "Chaat", "Plain naan", "Garlic naan", "Pilau rice", "Steamed rice", "Chicken madras", "Vegetable madras", "Chicken vindaloo", "Chicken jalfrezi", "Chicken roghan josh", "Lamb roghan josh", "Beef roghan josh", "Butter chicken", "Dosa", "Gulab jamun", "Chicken korma", "Mutter paneer", "Papadum", "Paratha", "Raita", "Saag paneer", "Tandoori chicken", "Chicken tikka masala", "Pakora", "Dal", "Chapati", "Pasanda", "Aloo gobi", "Kofta", "Chicken makhani", "Paneer naan", "Chana Aloo Curry"],
  mexico: ["Chilaquiles", "Pozole", "Tacos al pastor", "Tostadas", "Chiles en nogada", "Elote", "Enchiladas", "Mole", "Guacamole", "Tamales", "Huevos rancheros", "Machaca", "Discada", "Beef Burrito", "Chicken Burrito", "Pozole de pollo o duajolote", "Menudo", "Cochinita pibil", "Tamale", "Quesadilla", "Frijoles puercos", "Chile en nogada", "Esquites", "Alegria de amaranto", "Pipián", "Aguachile", "Ceviche", "Pescado zarandeado", "Camarones a la diabla", "Birria de chivo", "Tlayuda", "Guacamole con chapulines", "Flautas", "Torta Ahogada", "Carnitas", "Caldo Azteca", "Gorditas de Nata"],
  japan: ["Sushi", "Udon", "Tofu", "Tempura", "Yakitori", "Sashimi", "Ramen", "Donburi", "Natto", "Oden", "Tamagoyaki", "Soba", "Tonkatsu", "Kashipan", "Sukiyaki", "Miso soup", "Okonomiyaki", "Mentaiko", "Nikujaga", "Unagi no kabayaki", "Shabu Shabu", "Onigiri", "Gyoza", "Takoyaki", "aiseki ryori", "Edamame", "Yakisoba", "Chawanmushi", "Wagashi"],
  france: ["Foie gras", "Huîtres", "Cassoulet", "Poulet basquaise", "Escargots au beurre persillé", "Mouclade charentaise", "Galettes bretonnes", "Flemish carbonnade", "Quiche lorraine", "Raclette", "Cheese fondue", "Beef fondue", "Gratin dauphinois", "Tartiflette", "Bouillabaisse", "Ratatouille", "Boeuf bourguignon", "Blanquette de veau", "Pot-au-feu", "Coq-au-vin", "Hachis parmentier", "Steak tartare", "Choucroute", "Soufflé au fromage", "Cuisses de grenouilles", "Soupe à l’oignon", "Baguette", "Croissant", "French cheeses", "Fondant au chocolat", "Tarte tatin", "Macarons", "Crème brûlée", "Île flottante", "Profiteroles", "Pain au chocolat"],
  lebanon: ["Kibbeh", "Kafta", "Kanafeh", "Hummus", "Rice pilaf", "Fattoush", "Manakish", "Tabbouleh", "Sfeeha", "Fattoush", "Labneh", "Muhammara", "Lahm bi ajin", "Kaak", "Chanklich", "Mssabaha", "Shawarma", "Kebbe", "Falafel", "Halewit el jeben", "Namoura", "Maamoul", "Foul mdammas", "Balila", "Kawarma", "Fattouch"],
  thailand: ["Pad kra pao moo", "Tom kha gai", "Khao Pad", "Chicken pad Thai", "Vegetable pad Thai", "Moo satay", "Tom yum goong", "Khao niew mamuang", "Kai yad sai", "Khao soi", "Pad see ew", "Laab moo", "Gaeng panang", "Gai pad med ma muang", "Som tam", "Poh pia tod", "Gaeng massaman", "Pla kapung nueng manao", "Tod mun pla", "Gaeng ped", "Gaeng garee", "Gaeng keow wan", "Moo ping", "Durian", "Sai ooah", "Hoy tod", "Kuay teow reua", "Mu kratha", "Kao ka moo", "Yam nua"],
  greece: ["Moussaka", "Papoutsakia", "Pastitsio", "Souvlaki", "Soutzoukakia", "Stifado", "Tomatokeftedes", "Tzatziki", "Kolokithokeftedes", "Giouvetsi", "Choriatiki", "Kleftiko", "Gemista", "Fasolada", "Bougatsa", "Tiropita", "Spanakopita", "Feta Cheese with Honey", "Horta", "Tirokroketes", "Briam", "Saganaki", "Gigantes", "Dolmades", "Fasolatha", "Koulouri", "Loukoumades", "Gyros", "Galaktoboureko", "Baklava"],
  turkey: ["Şiş kebap", "Döner", "Köfte", "Pide", "Kumpir", "Meze", "Mantı", "Lahmacun", "Menemen", "Şiş kebap", "İskender kebab", "Corba", "Kuzu tandir", "Çiğ Köfte", "Pilav", "Yaprak sarma", "Dolma", "İmam bayıldı", "Borek", "Durum", "Kumpir", "Balik ekmek", "Simit", "Kunefe", "Baklava", "Lokum", "Halva", "Mozzaik pasta", "Güllaç", "Mercimek Köftesi", "Haydari", "Tursu suyu", "Kahvalti", "Kazan dibi", "Hunkar begendi", "Islak burgers", "Salep", "Yogurtlu kebab"],
  spain: ["Tortilla de patatas", "Fabada asturiana", "Calçots", "Boquerones al vinagre", "Empanada gallega", "Paella", "Gazpacho", "Gachas", "Migas", "Bocadillo de calamares", "Pulpo a feira", "Caldo gallego", "Lentejas con chorizo", "Cocido madrileño", "Cachopo", "Caracoles"],
  venezuela: ["Pabellón criollo", "Arepa", "Mondongo", "Empanadas", "Quesillo", "Chicha andina", "Tequeños", "Cachapa", "Hallaca", "Perico", "Pasticho", "Mandocas", "Caraotas negras", "Patacones", "Dulce de leche", "Pan de Jamón"],
  chile: ["Humitas", "Empanadas", "Porotos con riendas", "Completos", "Manjar", "Cordero al palo", "Pastel de choclo", "Mote con huesillos", "Sopaipillas", "Curanto"],
  argentina: ["Milanesas", "Empanadas", "Pizza fugazeta", "Asado", "Choripan", "Bondiola", "Bife de chorizo"],
  colombia: ["Bandeja paisa", "Chuleta valluna", "Sancocho trifásico", "Empanada valluna", "Salpicon de frutas", "Pastel de garbanzo", "Ajiaco", "Arepas", "Arroz de lisa", "Sancocho", "Pan de bono", "Cuchuco", "Oblea", "Cazuela de mariscos", "Pan de yuca", "Bollo Limpio", "Almojábana", "Empanadas", "Arroz con Coco", "Sopa de mondongo", "Cazuela de Mariscos", "Arroz con Pollo", "Arepa de Huevo", "Mote de Queso"],
  ecuador: ["Encebollado", "Ceviche", "Tigrillo", "Bolon de verde", "Llapingacho", "Mote pillo", "Locro de papa", "Churrasco"],
  peru: ["Ceviche", "Arroz con pollo", "Aji de gallina", "Llunca de gallina"],
  romania: ["Sarmale", "Mici", "Pomana porcului", "Ciorbă de fasole cu ciolan", "Ciorbă de burtă", "Ciorbă rădăuțeană", "Plăcintă cu brânză", "Ciorbă de potroace", "Mămăligă cu brânză și smântână", "Tochitură", "Piftie", "Iahnie de fasole", "Slănină afumată", "Cârnați afumați", "Varză a la Cluj", "Gulaș de cartofi cu afumătură", "Cozonac de casă", "Ciorbă ardelenească de porc", "Mucenici moldovenești", "Salată de boeuf", "Dovleac copt", "Papanași cu brânză de vacă și afine", "Drob de miel", "Pârjoale moldovenești", "Zacuscă de vinete", "Zacuscă de fasole", "Turtă dulce", "Clătitele cu gem", "Clătitele cu brânza de vacă", "Balmoș", "Cozonac", "Chiftele"]
};

var _Object$keys$1;

const totalOrigins = (_Object$keys$1 = Object.keys(data$16)) == null ? void 0 : _Object$keys$1.length;
/**
 * Generate a random food name.
 *
 * @category Food
 *
 * @example
 *
 * randFood()
 *
 * @example
 *
 * randFood({ origin: 'italy' })
 *
 * @example
 *
 * randFood({ length: 10 })
 *
 */

function randFood(options) {
  const foodData = data$16;
  const origin = options == null ? void 0 : options.origin;

  if (!totalOrigins) {
    throw 'No foods found';
  }

  if (origin && !foodData[origin]) {
    throw 'No foods found for selected origin';
  }

  const factory = () => {
    if (origin) {
      return randElement(foodData[origin]);
    }

    const originIndex = getRandomInRange({
      min: 0,
      max: totalOrigins - 1
    });
    const randomOrigin = Object.keys(foodData)[originIndex];
    return randElement(foodData[randomOrigin]);
  };

  return fake(factory, options);
}

var data$15 = ["AFC Bournemouth", "Alavés", "Arsenal", "Aston Villa", "Athletic Bilbao", "Atlético Madrid", "Barcelona", "Barnsley", "Birmingham City", "Blackburn Rovers", "Blackpool", "Bolton Wanderers", "Bradford City", "Brentford", "Brighton and Hove Albion", "Burnley", "Cádiz", "Cardiff City", "Celta Vigo", "Charlton Athletic", "Chelsea", "Coventry City", "Crystal Palace", "Derby County", "Elche", "Espanyol", "Everton", "Fulham", "Getafe", "Granada", "Huddersfield Town", "Hull City", "Ipswich Town", "Leeds United", "Leicester City", "Levante", "Liverpool", "Mallorca", "Manchester City", "Manchester United", "Middlesbrough", "Newcastle United", "Norwich City", "Nottingham Forest", "Oldham Athletic", "Osasuna", "Portsmouth", "Queens Park Rangers", "Rayo Vallecano", "Reading", "Real Betis", "Real Madrid", "Real Sociedad", "Sevilla", "Sheffield United", "Sheffield Wednesday", "Southampton", "Stoke City", "Sunderland", "Swansea City", "Swindon Town", "Tottenham Hotspur", "Valencia", "Villarreal", "Watford", "West Bromwich Albion", "West Ham United", "Wigan Athletic", "Wimbledon", "Wolverhampton Wanderers", "River Plate", "Boca Juniors", "Atlético Nacional", "Independiente", "Llaneros", "Tigre", "Palmeiras", "Atletico Paranaense", "Sydney FC", "Melbourne Victory"];
/**
 * Generate a random football team.
 *
 * @category sports
 *
 * @example
 *
 * randFootballTeam()
 *
 * @example
 *
 * randFootballTeam({ length: 10 })
 *
 */

function randFootballTeam(options) {
  return fake(data$15, options);
}

var data$14 = ["always", "constantly", "usually", "normally", "frequently", "regularly", "often", "sometimes", "occasionally", "rarely", "infrequently", "seldom", "hardly", "never", "hourly", "daily", "weekly", "monthly", "yearly", "once", "twice"];
/**
 * Generate a random adverb for definite or indefinite frequency.
 *
 * @category date
 *
 * @example
 *
 * randFrequency()
 *
 * @example
 *
 * randFrequency({ length: 10 })
 *
 */

function randFrequency(options) {
  return fake(data$14, options);
}
/**
 * Generate a random full name.
 *
 * @category person
 *
 * @example
 *
 * randFullName()
 *
 * @example
 *
 * randFullName({ gender: 'female' }) // Emma Marková
 *
 * @example
 *
 * randFullName({ withAccents: false }) // return full name without special symbols like â, î or ô and etc
 *
 * @example
 *
 * randFullName({ length: 10 })
 *
 */


function randFullName(options) {
  const nameOptions = {
    withAccents: options == null ? void 0 : options.withAccents,
    gender: options == null ? void 0 : options.gender
  };
  return fake(() => `${randFirstName(nameOptions)} ${randLastName(nameOptions)}`, options);
}
/**
 * Generate a random future.
 *
 * @category date
 *
 * @example
 *
 * randFutureDate()
 *
 * @example
 *
 * randFutureDate({ length: 10 })
 *
 * @example
 *
 * randFutureDate({ years: 10 }) // default is 1
 *
 */


function randFutureDate(options) {
  var _options$years;

  const years = (_options$years = options == null ? void 0 : options.years) != null ? _options$years : 1;

  if (years <= 0) {
    throw new Error('Years must be positive, use past() instead');
  }

  const yearsInMilliseconds = years * 365 * 24 * 60 * 60 * 1000;
  const from = new Date();
  const to = new Date(from.getTime() + yearsInMilliseconds);
  return fake(() => randBetweenDate({
    from,
    to
  }), options);
}

var data$13 = ["Cisgender", "Male to female transgender woman", "Androgyne", "Bigender", "Pangender", "Cis", "Transexual Person", "Transgender Female", "Female to male transsexual man", "Gender neutral", "Intersex woman", "Intersex", "Transexual Female", "Trans*Male", "Cisgender Male", "Transexual Woman", "Trans Female", "Gender Variant", "Male to Female", "Two-spirit", "Trans Man", "Gender Nonconforming", "Non-binary", "Transgender Person", "Cisgender Woman", "Cis Woman", "Cis Female", "Trans*Woman", "Polygender", "M2F", "Neither", "Male to female transsexual woman", "Intersex man", "Asexual", "Transexual", "Cis Male", "T* woman", "Woman", "Cisgender Female", "Other", "T* man", "Androgynous", "Trans Male", "Male to female trans woman", "Transexual Male", "Cis Man", "Female to male transgender man", "Genderqueer", "Neutrois", "Intersex person", "FTM", "Hermaphrodite", "Female to Male"];
var data$12 = ["Andro", "Bi", "Pan", "F", "M", "Cis", "Cis M", "Cis W", "Cis F", "Demi", "T*", "T F", "GV", "T M", "T*M", "T*W", "Non-bi", "Poly", "M2F", "M2FT", "Ace", "W", "Other", "NC", "Q", "TC", "TGNC", "FTM", "GSM"];
/**
 * Generate a random gender.
 *
 * @category person
 *
 * @example
 *
 * randGender()
 *
 * @example
 *
 * randGender({ length: 10 })
 *
 * @example
 *
 * randGender({ code: true }) // default is false
 *
 */

function randGender(options) {
  return fake(options != null && options.code ? data$12 : data$13, options);
}

var data$11 = ["protocol-navigate", "array-quantify", "transmitter-override", "circuit-compress", "feed-program", "microchip-parse", "feed-quantify", "card-synthesize", "bus-reboot", "application-input", "firewall-generate", "monitor-transmit", "sensor-parse", "port-compress", "interface-reboot", "capacitor-program", "monitor-quantify", "transmitter-input"];
/**
 * Generate a random git branch.
 *
 * @category git
 *
 * @example
 *
 * randGitBranch()
 *
 * @example
 *
 * randGitBranch({ length: 10 })
 *
 */

function randGitBranch(options) {
  return fake(data$11, options);
}

function generator() {
  return randNumber({
    min: 0,
    max: 15
  }).toString(16);
}
/**
 * Generate a random hexa decimal.
 *
 * @category system
 *
 * @example
 *
 * randHexaDecimal()
 *
 * @example
 *
 * randHexaDecimal({ length: 10 })
 *
 */


function randHexaDecimal(options) {
  return fake(generator, options);
}

const commitShaLen = 40;
/**
 * Generate a random git sha.
 *
 * @category git
 *
 * @example
 *
 * randGitCommitSha()
 *
 * @example
 *
 * randGitCommitSha({ length: 10 })
 *
 */

function randGitCommitSha(options) {
  return fake(() => {
    let sha = '';

    for (let i = 0; i < commitShaLen; i++) {
      sha += randHexaDecimal();
    }

    return sha;
  }, options);
}
/**
 * Generate a random git message.
 *
 * @category git
 *
 * @example
 *
 * randGitCommitMessage()
 *
 * @example
 *
 * randGitCommitMessage({ length: 10 })
 *
 */


function randGitCommitMessage(options) {
  return fake(() => {
    const words = [];

    for (let i = 0; i < randNumber({
      min: 2,
      max: 5
    }); i++) {
      words.push(randWord());
    }

    return words.join(' ');
  }, options);
}
/**
 * Generate a random git commit.
 *
 * @category git
 *
 * @example
 *
 * randGitCommitEntry()
 *
 * @example
 *
 * randGitCommitEntry({ length: 10 })
 *
 */


function randGitCommitEntry(options) {
  return fake(() => {
    return `commit ${randGitCommitSha()}\\r\\nAuthor: ${randFullName()} <${randEmail()}>\\r\\nDate: ${new Date().toString()}\\r\\n\\r\\n${randGitCommitMessage()}`;
  }, options);
}

const commitShortShaLen = 7;
/**
 * Generate a random git short sha.
 *
 * @category git
 *
 * @example
 *
 * randGitShortSha()
 *
 * @example
 *
 * randGitShortSha({ length: 10 })
 *
 */

function randGitShortSha(options) {
  return fake(() => {
    let sha = '';

    for (let i = 0; i < commitShortShaLen; i++) {
      sha += randHexaDecimal();
    }

    return sha;
  }, options);
}
/**
 * Generate a random hex.
 *
 * @category colors
 *
 * @example
 *
 * randHex()
 *
 * @example
 *
 * randHex({ length: 10 })
 *
 */


function randHex(options) {
  return fake(() => `#${random().toString(16).substr(2, 6)}`, options);
}

var data$10 = ["Pottok", "Dutch Heavy Draft", "Spanish Barb", "Russian Heavy Draft", "American Saddlebred", "Camarillo White Horse", "Karachai Horse", "Andalusian Horse", "Poitevin Horse", "Colorado Ranger", "Paso Fino", "Swiss Warmblood", "Murgese", "Selle Français", "Riwoche Horse", "French Trotter", "American Indian Horse", "Jeju Horse"];
/**
 * Generate a random horse.
 *
 * @category animals
 *
 * @example
 *
 * randHorse()
 *
 * @example
 *
 * randHorse({ length: 10 })
 *
 */

function randHorse(options) {
  return fake(data$10, options);
}
/**
 * Generate a random hsl color.
 *
 * @category colors
 *
 * @example
 *
 * randHsl()
 *
 * @example
 *
 * randHsl({ length: 3 })
 *
 * @example
 *
 * randHsl({ alpha: true }) // default is false
 *
 */


function randHsl(options) {
  const factory = () => {
    const [h, s, l, a] = [getRandomInRange({
      min: 0,
      max: 359,
      fraction: 0
    }), getRandomInRange({
      min: 0,
      max: 100,
      fraction: 0
    }), getRandomInRange({
      min: 0,
      max: 100,
      fraction: 0
    }), randFloat({
      min: 0.1,
      max: 1
    })];
    return options != null && options.alpha ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
  };

  return fake(factory, options);
}

var data$$ = ["GET", "POST", "PUT", "PATCH", "DELETE"];
/**
 * Generate a random http method.
 *
 * @category internet
 *
 * @example
 *
 * randHttpMethod()
 *
 * @example
 *
 * randHttpMethod({ length: 10 })
 *
 */

function randHttpMethod(options) {
  return fake(data$$, options);
}
/**
 * Generate a random IBAN number.
 *
 * @category finance
 *
 * @example
 *
 * randIban()
 *
 * @example
 *
 * randSwift({ countryCode: 'DE' }) // country code with ISO country code
 *
 * @example
 *
 * randIban({ length: 10 })
 *
 */


function randIban(options) {
  var _options$countryCode;

  if (options != null && options.countryCode && (options == null ? void 0 : (_options$countryCode = options.countryCode) == null ? void 0 : _options$countryCode.length) !== 2) {
    throw new Error('country code should be valid ISO 3166-1 alpha-2 two-letter country code, for example: DE');
  }

  const factory = () => {
    var _options$countryCode2;

    const countryCode = (_options$countryCode2 = options == null ? void 0 : options.countryCode) != null ? _options$countryCode2 : randCountryCode();
    const checkDigits = randNumber({
      min: 10,
      max: 99
    }).toString();
    const bban = Array(randNumber({
      min: 12,
      max: 30
    })).fill('#').join('').replace(/#/g, () => {
      return randAlphaNumeric().toString();
    });
    return `${countryCode}${checkDigits}${bban}`.toUpperCase();
  };

  return fake(factory, options);
}

var data$_ = ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montréal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"];
/**
 * Generate a random ice hockey team.
 *
 * @category sports
 *
 * @example
 *
 * randIceHockeyTeam()
 *
 * @example
 *
 * randIceHockeyTeam({ length: 10 })
 *
 */

function randIceHockeyTeam(options) {
  return fake(data$_, options);
}
/**
 * Generate a random img.
 *
 * @category General
 *
 * @example
 *
 * randImg()
 *
 * @example
 *
 * randImg({ length: 10 })
 *
 */


function randImg(options) {
  var _options$width, _options$height, _options$category;

  const [width, height, category] = [(_options$width = options == null ? void 0 : options.width) != null ? _options$width : 500, (_options$height = options == null ? void 0 : options.height) != null ? _options$height : 500, (_options$category = options == null ? void 0 : options.category) != null ? _options$category : ''];
  return fake(() => `https://placeimg.com/${width}/${height}${category ? `/${category}` : category}`, options);
}

var data$Z = ["Slack", "GitHub", "Jira", "AWS Lambda", "Bitbucket", "Bitbucket Server", "GitHub Enterprise", "GitLab", "Grafana", "Jira Server", "Microsoft Teams", "PagerDuty", "Vercel", "Azure DevOps", "WebHooks", "Amixr", "Calixa", "ClickUp", "Komodor", "Linear", "Rookout", "Shortcut", "Spike.sh", "Split", "TaskCall", "Teamwork", "Asana", "OpenReplay", "Bitbucket Pipelines", "Datadog", "FullStory", "GitHub Actions", "Heroku", "InsightFinder", "Netlify", "Octohook", "Learn More", "Pivotal Tracker", "Rocket.Chat", "Trello", "Twilio (SMS)", "OpsGenie", "Phabricator", "Pushover", "Redmine", "SessionStack", "VictorOps", "Amazon SQS", "Segment", "Splunk"];
/**
 * Generate a random integration.
 *
 * @category internet
 *
 * @example
 *
 * randIntegrations()
 *
 * @example
 *
 * randIntegrations({ length: 10 })
 *
 */

function randIntegration(options) {
  return fake(data$Z, options);
}

const ipRange = {
  min: 0,
  max: 255
};
/**
 * Generate a random ip.
 *
 * @category internet
 *
 * @example
 *
 * randIp()
 *
 * @example
 *
 * randIp({ length: 10 })
 *
 */

function randIp(options) {
  return fake(() => Array.from({
    length: 4
  }, () => randNumber(ipRange)).join('.'), options);
}
/**
 * Generate a random ipv6.
 *
 * @category internet
 *
 * @example
 *
 * randIpv6()
 *
 * @example
 *
 * randIpv6({ length: 10 })
 *
 */


function randIpv6(options) {
  return fake(() => {
    return Array.from({
      length: 8
    }, () => {
      return Array.from({
        length: 4
      }, () => randHexaDecimal()).join('');
    }).join(':');
  }, options);
}

var data$Y = ["Brand", "Tactics", "Markets", "Usability", "Operations", "Integration", "Identity", "Marketing", "Creative", "Response", "Branding", "Quality", "Program", "Accounts", "Accountability", "Interactions", "Security", "Applications", "Configuration", "Factors", "Paradigm", "Division", "Group", "Data", "Directives", "Optimization", "Web", "Functionality", "Research", "Intranet", "Solutions", "Mobility", "Communications", "Metrics", "Assurance"];
/**
 * Generate a random job area.
 *
 * @category Jobs
 *
 * @example
 *
 * randJobArea()
 *
 * @example
 *
 * randJobArea({ length: 10 })
 *
 */

function randJobArea(options) {
  return fake(data$Y, options);
}

var data$X = ["Senior", "Corporate", "Future", "International", "Global", "Central", "Product", "Internal", "National", "Direct", "Customer", "Human", "Lead", "District", "Chief", "Dynamic", "Principal", "Forward", "Legacy", "Regional", "Investor"];
/**
 * Generate a random job descriptor.
 *
 * @category jobs
 *
 * @example
 *
 * randJobDescriptor()
 *
 * @example
 *
 * randJobDescriptor({ length: 10 })
 *
 */

function randJobDescriptor(options) {
  return fake(data$X, options);
}

var data$W = ["Internal Quality Coordinator", "Legacy Marketing Planner", "Investor Configuration Specialist", "Human Directives Engineer", "District Quality Technician", "Central Mobility Liaison", "International Interactions Orchestrator", "Central Implementation Producer", "Forward Configuration Facilitator", "Internal Solutions Coordinator", "Global Web Agent", "International Brand Associate", "Regional Applications Strategist", "Direct Brand Analyst", "Investor Mobility Consultant", "Principal Division Supervisor", "Chief Interactions Administrator", "District Web Facilitator", "Investor Metrics Consultant", "Corporate Applications Director", "Corporate Group Planner", "Global Functionality Manager", "Principal Web Engineer", "National Directives Executive", "Dynamic Factors Officer", "Principal Identity Supervisor", "Dynamic Solutions Administrator", "Corporate Interactions Analyst", "Senior Configuration Consultant", "Human Web Consultant", "Customer Metrics Technician", "Senior Solutions Producer", "Central Operations Technician", "Product Security Producer", "Forward Security Executive", "Dynamic Assurance Architect", "Internal Integration Representative", "Lead Web Developer", "Human Directives Assistant", "Internal Operations Representative", "Chief Communications Associate", "Principal Branding Strategist", "International Paradigm Specialist", "Regional Security Administrator", "Forward Operations Architect", "Product Mobility Orchestrator", "Lead Functionality Orchestrator", "Lead Solutions Consultant", "Human Markets Strategist", "International Infrastructure Engineer", "Dynamic Response Officer", "Dynamic Quality Engineer", "National Creative Strategist", "Principal Security Representative", "Internal Usability Executive", "Product Usability Coordinator", "Global Optimization Associate", "Global Configuration Executive", "Global Research Engineer", "Regional Accounts Associate", "Central Identity Agent", "Principal Program Officer", "Senior Group Developer", "Forward Research Coordinator", "Legacy Identity Developer", "Central Interactions Developer", "Direct Research Technician", "Chief Web Planner", "Investor Program Architect", "National Intranet Architect", "Principal Operations Administrator", "Legacy Security Associate", "Global Communications Architect", "Forward Configuration Analyst", "Customer Program Representative", "Dynamic Communications Director", "Dynamic Division Architect", "Customer Security Manager", "Dynamic Branding Analyst", "Internal Configuration Agent", "Principal Program Liaison", "Regional Research Administrator", "Dynamic Functionality Coordinator", "Investor Configuration Producer", "Direct Web Engineer", "Central Implementation Orchestrator", "Investor Tactics Strategist", "National Creative Agent", "Central Intranet Specialist", "Future Creative Strategist", "Product Intranet Liaison", "Dynamic Markets Consultant", "Global Infrastructure Administrator", "Lead Interactions Supervisor", "Future Usability Designer", "Principal Research Producer", "International Quality Facilitator", "Legacy Data Director", "Dynamic Infrastructure Representative", "Direct Paradigm Analyst"];
/**
 * Generate a random job title.
 *
 * @category Jobs
 *
 * @example
 *
 * randJobTitle()
 *
 * @example
 *
 * randJobTitle({ length: 10 })
 *
 */

function randJobTitle(options) {
  return fake(data$W, options);
}

var data$V = ["Director", "Representative", "Officer", "Coordinator", "Engineer", "Designer", "Developer", "Specialist", "Analyst", "Orchestrator", "Technician", "Executive", "Assistant", "Producer", "Liaison", "Consultant", "Architect", "Associate", "Manager", "Agent", "Facilitator", "Planner", "Administrator", "Supervisor"];
/**
 * Generate a random job type.
 *
 * @category jobs
 *
 * @example
 *
 * randJobType()
 *
 * @example
 *
 * randJobType({ length: 10 })
 *
 */

function randJobType(options) {
  return fake(data$V, options);
}

var data$U = ["Afrikaans", "Amharic", "Arabic", "Azerbaijani", "Byelorussian", "Bulgarian", "Bengali,Bangla", "Bosnian", "Catalan", "Cebuano", "Corsican", "Czech", "Welsh", "Danish", "German", "Greek", "English", "Esperanto", "Spanish", "Estonian", "Basque", "Persian", "Finnish", "French", "Frisian", "Irish", "Gaelic (Scots Gaelic)", "Galician", "Gujarati", "Hausa", "Hindi", "Hmong", "Croatian", "Haitian Creole", "Hungarian", "Armenian", "Indonesian", "Igbo", "Icelandic", "Italian", "Hebrew", "Japanese", "Javanese", "Georgian", "Kazakh", "Cambodian", "Kannada", "Korean", "Kurdish", "Kirghiz", "Latin", "Luxembourgish", "Laothian", "Lithuanian", "Latvian,Lettish", "Malagasy", "Maori", "Macedonian", "Malayalam", "Mongolian", "Marathi", "Malay", "Maltese", "Burmese", "Nepali", "Dutch", "Norwegian", "Nyanja", "Punjabi", "Polish", "Pashto,Pushto", "Portuguese", "Romanian", "Russian", "Sindhi", "Singhalese", "Slovak", "Slovenian", "Samoan", "Shona", "Somali", "Albanian", "Serbian", "Sesotho", "Sundanese", "Swedish", "Swahili", "Tamil", "Tegulu", "Tajik", "Thai", "Turkish", "Ukrainian", "Urdu", "Uzbek", "Vietnamese", "Xhosa", "Yiddish", "Yoruba", "Chinese", "Zulu"];
var data$T = ["af", "am", "ar", "az", "be", "bg", "bn", "bs", "ca", "ce", "co", "cs", "cy", "da", "de", "el", "en", "eo", "es", "et", "eu", "fa", "fi", "fr", "fy", "ga", "gd", "gl", "gu", "ha", "hi", "hm", "hr", "ht", "hu", "hy", "id", "ig", "is", "it", "iw", "ja", "jv", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "lb", "lo", "lt", "lv", "mg", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "pa", "pl", "ps", "pt", "ro", "ru", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "tr", "uk", "ur", "uz", "vi", "xh", "yi", "yo", "zh", "zu"];
/**
 * Generate a random language.
 *
 * @category person
 *
 * @example
 *
 * randLanguage()
 *
 * @example
 *
 * randLanguage({ length: 10 })
 *
 * @example
 *
 * randLanguage({ code: true }) // default is false
 *
 */

function randLanguage(options) {
  return fake(options != null && options.code ? data$T : data$U, options);
}
/**
 * Generate a random latitude.
 *
 * @category address
 *
 * @example
 *
 * randLatitude()
 *
 * @example
 *
 * randLatitude({ length: 10 })
 *
 */


function randLatitude(options) {
  return fake(() => getRandomInRange({
    min: -90,
    max: 90,
    fraction: 3
  }), options);
}

const maxWords = 50;

function getSpecialCharacter(wordCount) {
  const randomNumber = getRandomInRange({
    min: 1,
    max: 10,
    fraction: 0
  });

  if (randomNumber === 1 || wordCount === maxWords) {
    return '.';
  }

  if (randomNumber === 2) {
    return ',';
  }

  return '';
}
/**
 * Generate a random sentence.
 *
 * @category text
 *
 * @example
 *
 * randSentence()
 *
 * @example
 *
 * randSentence({ length: 10 })
 *
 */


function randSentence(options) {
  const factory = () => {
    let text = randWord({
      capitalize: true
    });
    let wordCount = 1;

    while (wordCount < maxWords) {
      const randomWord = randWord();
      let specialChar = '';
      wordCount++;

      if (wordCount > 3) {
        specialChar = getSpecialCharacter(wordCount);
      }

      text += ` ${randomWord}${specialChar}`;

      if (specialChar === '.') {
        break;
      }
    }

    return text;
  };

  return fake(factory, options);
}
/**
 * Generate random lines.
 *
 * @category text
 *
 * @example
 *
 * randLine()
 *
 * @example
 *
 * randLine({ lineCount: 10 }) // default is 5
 *
 */


function randLine(options) {
  var _options$lineCount;

  const lineCount = (_options$lineCount = options == null ? void 0 : options.lineCount) != null ? _options$lineCount : 5;

  if (lineCount < 1 || isNaN(lineCount)) {
    throw 'Line count must be greater than 0';
  }

  const factory = () => {
    let lines = `${randSentence()}\n`;

    for (let i = 0; i < lineCount - 1; i++) {
      lines += `${randSentence()}\n`;
    }

    return lines;
  };

  return fake(factory, options);
}

var data$S = ["Commodi est rerum dolorum quae voluptatem aliquam.", "Minima qui ut nulla eius.\\nA incidunt ipsum tempore porro tempore.\\nFugit quas voluptas ducimus aut.\\nTempore nostrum velit expedita voluptate est.\\nNam iste explicabo tempore impedit voluptas.", "Dolorem sed neque sequi ad nulla.\\nEum tempora ut sit et ducimus.\\nVel a expedita dignissimos.\\nFacilis iste ut.\\nAd saepe doloremque possimus mollitia atque explicabo.", "Omnis quidem vero eius sed laudantium a ex a saepe.\\nModi qui laudantium in libero odit et impedit.", "Doloribus temporibus dolorum placeat.\\nFugit nulla quaerat.\\nEveniet ratione odit sed non rerum.\\nNemo tempore eveniet veritatis alias repellat et.\\nVoluptas nisi quis commodi id.", "Sunt hic autem eum sint quia vitae.", "Laborum est maxime enim accusantium magnam.\\nRerum dolorum minus laudantium delectus eligendi necessitatibus quia.\\nDeleniti consequatur explicabo aut nobis est vero tempore.\\nExcepturi earum quo quod voluptatem quo iure vel sapiente occaecati.\\nConsectetur consequatur corporis doloribus omnis harum voluptas esse amet.", "Sed dolores nostrum quis.", "Autem sed aspernatur aut sint ipsam et facere rerum voluptas.\\nPerferendis eligendi molestias laudantium eveniet eos.\\nId veniam asperiores quis voluptates aut deserunt.\\nTempora et eius dignissimos nulla iusto et omnis pariatur.\\nSit mollitia eum blanditiis suscipit.", "Temporibus aut adipisci magnam aliquam eveniet nihil laudantium reprehenderit sit.\\nAspernatur cumque labore voluptates mollitia deleniti et.", "Ipsam voluptate fugiat iusto illo dignissimos rerum sint placeat.\\nLabore sit omnis.", "Deserunt ab porro similique est accusamus id enim aut suscipit.\\nSoluta reprehenderit error nesciunt odit veniam sed.\\nDolore optio qui aut ab.\\nAut minima provident eius repudiandae a quibusdam in nisi quam.", "Mollitia nostrum exercitationem sunt rem.\\nRem et voluptas consequatur mollitia nostrum.\\nSunt nesciunt et pariatur quam provident impedit.", "Ipsum eos ipsam.\\nAperiam quia quis sit fugiat saepe voluptas est.\\nDolores et veniam ut.\\nQuibusdam voluptatum quis.\\nEt omnis ut corporis.", "Quia consequatur voluptatibus et.\\nVoluptatibus aspernatur et.\\nDicta architecto qui dignissimos.\\nVeritatis facilis voluptatem inventore aliquid cum.\\nNumquam odio quis porro sunt adipisci culpa.", "Totam ab necessitatibus quidem non.", "Quia quo iste et aperiam voluptas consectetur a omnis et.\\nDolores et earum consequuntur sunt et.\\nEa nulla ab voluptatem dicta vel.", "Qui corrupti at eius cumque adipisci ut sunt voluptates ab.", "Blanditiis non quos aut dolore nulla unde.\\nIncidunt repudiandae amet eius porro.\\nTempora unde sapiente repellat voluptatem omnis et ut omnis in.\\nEt pariatur odit qui minima perspiciatis non dolores.", "Sed odit quidem qui sed eum id eligendi laboriosam.", "Nisi vitae nostrum perspiciatis impedit laborum repellat ullam et ut.", "Quas ea voluptatem iste iure.\\nEt soluta et doloremque vero quis occaecati et fuga.\\nIncidunt recusandae dignissimos iusto quisquam sed unde at ea incidunt.\\nId voluptate incidunt qui totam autem voluptas maxime atque quaerat.\\nCorporis iste ut molestiae.", "Qui soluta veritatis autem repellat et inventore occaecati.", "Totam voluptas consequatur officiis.\\nPlaceat sit nobis ut est quae dolore consequuntur vel.\\nRepudiandae ut molestias rerum occaecati quod.\\nRerum optio minus aliquid.\\nIllum et voluptas iusto molestiae nulla praesentium deserunt est voluptas.", "Ut atque harum inventore natus facere sed molestiae.\\nQuia aliquid ut.\\nAnimi sunt rem et sit ullam dolorem ab consequatur modi.", "Ut in omnis sapiente laboriosam autem laborum.\\nRepellendus et beatae qui qui numquam saepe.\\nNon vitae molestias quos illum.\\nSed fugiat qui ullam molestias ad ullam dolore.\\nAutem ex minus distinctio dicta sapiente beatae veritatis at.", "Nemo repudiandae molestiae.\\nNobis sed ducimus aperiam.\\nBeatae cupiditate praesentium in omnis.", "Voluptatem sed debitis.\\nArchitecto sint et deleniti et quod possimus cupiditate.\\nTempore aut eum ipsum recusandae aliquid.", "Qui eligendi molestiae molestiae sit rem quis.\\nDucimus voluptates ut ducimus possimus quis.\\nCupiditate velit cupiditate harum impedit minima veniam ipsam amet atque.\\nEt architecto molestiae omnis eos aspernatur voluptatem occaecati non.\\nMolestiae inventore aut aut nesciunt totam eum a expedita illo.", "Consequuntur dolorem enim eos sit.\\nMollitia impedit dolor optio et dolorem.\\nVitae nulla eos excepturi culpa.\\nMagni iure optio quaerat.\\nAb sed sit autem et ut eum.", "Et fuga repellendus magnam dignissimos eius aspernatur rerum.", "Debitis facilis dolorum maiores aut et.\\nEa voluptas magnam deserunt at ut sunt voluptatem.\\nEt voluptatem voluptatem.\\nUt est fugiat magnam.", "Temporibus quod quidem placeat porro.\\nUnde ipsam vel explicabo.", "Voluptatum tempora voluptas est odio iure odio dolorem.\\nVoluptatum est deleniti explicabo explicabo harum provident quis molestiae.", "Laborum excepturi numquam sequi reiciendis voluptate repellat sint.\\nQui inventore ipsam voluptatem sit quos.\\nDolorem aut quod suscipit fugiat culpa.\\nOdio nostrum praesentium accusantium dolor quo.", "Voluptatem velit ut deserunt.\\nQuibusdam eius repellat.", "Illum voluptates ut vel et.\\nUt debitis excepturi suscipit perferendis officia numquam possimus.\\nFacere sit doloremque repudiandae corrupti veniam qui.", "Autem reiciendis provident iure possimus.\\nOccaecati soluta quibusdam libero tenetur minus vel sit illo.\\nCulpa optio dolorem eos similique voluptatem voluptatibus error accusantium.", "Ipsa cumque ad repellat qui libero quia impedit fugiat.\\nExcepturi ut vitae recusandae eos quisquam et voluptatem.\\nNeque nostrum distinctio provident eius tempore odio aliquid.\\nSaepe ut suscipit architecto.", "Non natus nihil.", "Ad voluptate vel.\\nAut aut dolor.", "Est est sed itaque necessitatibus vitae officiis.\\nIusto dolores sint eveniet quasi dolore quo laborum esse laboriosam.\\nModi similique aut voluptates animi aut dicta dolorum.\\nSint explicabo autem quidem et.\\nNeque aspernatur assumenda fugit provident.", "Voluptatibus harum ullam odio sed animi corporis.", "Laborum itaque quos provident.\\nRerum cupiditate praesentium amet voluptatem dolor impedit modi dicta.\\nVoluptates assumenda optio est.\\nNon aperiam nam consequuntur vel a commodi dicta incidunt.", "Et perspiciatis illo.\\nLaboriosam aspernatur omnis expedita doloribus.\\nEum aliquam provident voluptas similique et omnis.", "Ipsa laudantium deserunt.", "Nesciunt numquam velit nihil qui quia eius.", "Voluptate et quasi optio eos et eveniet culpa et nobis.\\nSint aut sint sequi possimus reiciendis nisi.\\nRerum et omnis et sit doloribus corporis voluptas error.\\nIusto molestiae tenetur necessitatibus dolorem omnis.", "Quia harum nulla et quos sint voluptates exercitationem corrupti.", "Similique et quos maiores commodi exercitationem laborum animi qui.", "Ab quis aut earum.\\nVoluptatem sint accusantium sed cupiditate optio.\\nConsequatur in dolores aut enim.\\nNon sunt atque maxime dolores.\\nNam impedit sit.", "Sunt excepturi ut dolore fuga.\\nAutem eum maiores aut nihil magnam corporis consectetur sit.", "Cum vitae aliquam neque consequatur quia id dicta ipsam.\\nExercitationem ab eum exercitationem non alias numquam qui.\\nItaque rerum ut nobis est nam vitae exercitationem minima fugiat.\\nEst sit non tempora soluta consequatur eveniet.\\nCorporis nisi dolorem architecto voluptatem.", "Qui et dolorum.\\nEveniet architecto qui accusamus et modi harum facilis a eum.\\nEt vel cumque voluptatem earum minima perferendis.", "Consequatur odit voluptatem qui.\\nQui quis sequi vel corrupti asperiores soluta rerum.\\nIusto at id quod reiciendis.", "Dolorum eius dignissimos et magnam voluptate aut voluptatem natus.\\nAut sint est eum molestiae consequatur officia omnis.\\nQuae et quam odit voluptatum itaque ducimus magni dolores ab.\\nDolorum sed iure voluptatem et reiciendis.", "Id est non ad temporibus nobis.\\nQuod soluta quae voluptatem quisquam est.", "Exercitationem suscipit enim et aliquam dolor.", "Deleniti explicabo assumenda ipsum cumque voluptatem blanditiis voluptatum omnis provident.\\nQuis placeat nisi fugit aperiam quaerat mollitia.\\nOccaecati repellendus voluptate similique.\\nLaboriosam qui qui voluptas itaque ipsa.", "Voluptas aut occaecati cum et quia quam.\\nBeatae libero doloribus nesciunt iusto.\\nDolores vitae neque quisquam qui ipsa ut aperiam.", "Eveniet sit ipsa officiis laborum.\\nIn vel est omnis sed impedit quod magni.\\nDignissimos quis illum qui atque aut ut quasi sequi.", "Voluptatem cumque molestias soluta consequatur aut voluptatibus beatae vel commodi.\\nNulla voluptatem aut.", "Pariatur quo neque est perspiciatis non illo rerum expedita minima.\\nEt commodi voluptas eos ex.\\nUnde velit delectus deleniti deleniti non in sit.\\nAliquid voluptatem magni.", "Aut ipsa et qui vel similique sed hic a.\\nVoluptates dolorem culpa nihil aut ipsam voluptatem.", "Animi enim quo deserunt.\\nAmet facilis at laboriosam.\\nRerum assumenda harum et sapiente suscipit ipsa fugiat.\\nSunt ut aut rem expedita consequatur optio.\\nRecusandae tenetur rerum quos culpa.", "Maiores assumenda porro est ea necessitatibus qui qui dolorum.\\nVelit suscipit ut ipsam odit aut earum.", "Placeat sequi quaerat sapiente aspernatur autem sunt molestiae voluptatem.\\nAccusamus unde libero accusamus omnis totam et temporibus.", "Nemo tempore dolor maiores blanditiis quia qui qui voluptatem non.\\nNisi dolores animi laboriosam aliquam qui adipisci voluptates atque dignissimos.\\nLibero sit quibusdam corporis aut inventore natus libero.\\nPraesentium omnis dolorum temporibus repellendus qui.\\nNon nostrum doloribus occaecati dolores sit ut.", "Libero sed ut architecto.\\nEx itaque et modi aut voluptatem alias quae.\\nModi dolor cupiditate sit.\\nDelectus consectetur nobis aliquid deserunt sint ut et voluptas.\\nCorrupti in labore laborum quod.", "Est aut quis soluta accusantium debitis vel.\\nQuisquam aliquid ex corporis velit.", "Provident saepe omnis non molestiae natus et.\\nAccusamus laudantium hic unde voluptate et sunt voluptatem.\\nMollitia velit id eius mollitia occaecati repudiandae.", "Ducimus dolores recusandae.\\nEa aut aperiam et aut eos inventore.\\nQuia cum ducimus autem iste.\\nQuos consequuntur est delectus temporibus autem.", "Sapiente vitae culpa ut voluptatem incidunt excepturi voluptates exercitationem.\\nSed doloribus alias consectetur omnis occaecati ad placeat labore.\\nVoluptate consequatur expedita nemo recusandae sint assumenda.\\nQui vel totam quia fugit saepe suscipit autem quasi qui.\\nEt eum vel ut delectus ut nesciunt animi.", "Eos pariatur eos fugit aut aperiam labore beatae.\\nVel non ea id dignissimos voluptate quis error assumenda consectetur.\\nRerum quas libero totam error facere sunt facilis quo.\\nEveniet debitis et aliquid ratione.", "Incidunt doloremque enim autem quam et magnam et expedita fuga.\\nPlaceat quia dolor ut.\\nNon dolor amet temporibus quas non hic sed.\\nQui tempore enim mollitia omnis sed ut eos rerum et.\\nQuidem voluptas est vel.", "Officia consectetur quibusdam velit debitis porro quia cumque.\\nSuscipit esse voluptatem cum sit totam consequatur molestiae est.\\nMollitia pariatur distinctio fugit.", "Ipsa labore numquam aut quidem quia.\\nMinus ut et recusandae sed dolorem eveniet.\\nEst vero sit et omnis et explicabo exercitationem qui quasi.\\nQui maxime iusto alias sint nihil quas.\\nModi quaerat voluptatem reiciendis reiciendis vero.", "Sapiente maxime sequi.", "Ab rerum eos ipsa accusantium nihil voluptatem.\\nEum minus alias.\\nIure commodi at harum.\\nNostrum non occaecati omnis quisquam.", "Facere consequatur ullam.\\nSint illum iste ab et saepe sit ut quis voluptatibus.\\nQuo esse dolorum a quasi nihil.\\nError quo eveniet.\\nQuia aut rem quia in iste fugit ad.", "Sunt dolor maxime nam assumenda non beatae magni molestias quia.", "Facere beatae delectus ut.\\nPossimus voluptas perspiciatis voluptatem nihil sint praesentium.\\nSint est nihil voluptates nesciunt voluptatibus temporibus blanditiis.\\nOfficiis voluptatem earum sed.", "In ipsam mollitia placeat quia adipisci rerum labore repellat.", "Et sed dicta eveniet accusamus consequatur.\\nUllam voluptas consequatur aut eos ducimus.\\nId officia est ut dicta provident beatae ipsa.", "Consequatur exercitationem asperiores quidem fuga rerum voluptas pariatur.\\nRepellendus sit itaque nam.\\nDeleniti consectetur vel aliquam vitae est velit.\\nId blanditiis ullam sed consequatur omnis.", "Dicta quia molestias natus est.\\nSit animi inventore a ut ut suscipit.\\nEos et et commodi eligendi nihil.\\nEa reprehenderit consectetur eum.", "Iusto laborum aperiam neque delectus consequuntur provident est maiores explicabo.", "Cupiditate officia voluptatum.\\nTenetur facere eum distinctio animi qui laboriosam.\\nQuod sed voluptatem et cumque est eos.\\nSint id provident suscipit harum odio et.", "Quos pariatur tenetur.\\nQuasi omnis eveniet eos maiores esse magni possimus blanditiis.\\nQui incidunt sit quos consequatur aut qui et aperiam delectus.\\nPraesentium quas culpa.\\nEaque occaecati cumque incidunt et.", "Quo perferendis nesciunt.\\nDolore dolorem porro omnis voluptatibus consequuntur et expedita suscipit et.\\nTempora facere ipsa.\\nDolore accusamus soluta officiis eligendi.\\nEum quaerat neque eum beatae odio.", "Ut autem labore nisi iusto.\\nRepellendus voluptate eaque eligendi nam facere tempora soluta.\\nAnimi sed vero aut dignissimos.", "Officia vero fugiat sit praesentium fugiat id cumque.\\nEt iste amet dolores molestiae quo dignissimos recusandae.\\nAliquam explicabo facilis asperiores ea optio.\\nExplicabo ut quia harum corrupti omnis.\\nOmnis sit mollitia qui dolorem ipsam sed aut.", "Non enim expedita maiores incidunt voluptatem rem.\\nEt nam vel nihil non non.\\nVoluptates accusantium aut nisi et error doloribus molestiae voluptas soluta.", "Quis nesciunt ut est eos.\\nQui reiciendis doloribus.\\nEst quidem ullam reprehenderit.\\nEst omnis eligendi quis quis quo eum officiis asperiores quis.", "Reprehenderit quae quas quos sapiente ullam ut.\\nVoluptates non ut.", "Molestias non debitis quibusdam quis quod.\\nSaepe ab et hic unde et sed.\\nMagni voluptatem est.\\nEt similique quo porro et.", "Doloribus consequatur et labore suscipit deserunt tempore ad quasi sed.\\nQuam cupiditate modi dolor et eos et culpa qui.\\nDelectus molestias ea id.\\nIllum ea unde sapiente non non non.\\nDolorem ut sed magni.", "Rerum minus et quia et dolorem officiis sunt id.\\nPariatur dolorum sint blanditiis ex vero optio.\\nQuam numquam omnis porro voluptatem.", "Dolores accusamus ducimus suscipit neque fugit quo aliquam.\\nOdit eum eum sint accusamus.\\nQuod ipsum sed placeat.\\nEt culpa voluptas et quod atque a.\\nVoluptatibus rerum nihil quia cupiditate nihil facere beatae dolor.", "Fugit harum mollitia.\\nMagni eos asperiores assumenda ad."];
/**
 * Generate a random lines.
 *
 * @category text
 *
 * @example
 *
 * randLines()
 *
 * @example
 *
 * randLines({ length: 10 })
 *
 */

function randLines(options) {
  return fake(data$S, options);
}

var data$R = ["Cape lion", "Transvaal lion", "Masai Lion", "Barbary Lion", "West African Lion", "Northeast Congo Lion", "Asiatic Lion"];
/**
 * Generate a random lion.
 *
 * @category animals
 *
 * @example
 *
 * randLion()
 *
 * @example
 *
 * randLion({ length: 10 })
 *
 */

function randLion(options) {
  return fake(data$R, options);
}

var data$Q = ["cz", "ge", "ne", "it", "de_CH", "en_AU_ocker", "ja", "ar", "en_CA", "pt_BR", "de", "es", "vi", "hr", "en_ZA", "fr", "id_ID", "nb_NO", "zh_TW", "ro", "pl", "en_GB", "en_AU", "fr_CA", "hy", "ko", "en_BORK", "es_MX", "en_IE", "az", "nl_BE", "en_US", "sk", "fr_CH", "en_IND", "sv", "fi", "en", "zh_CN", "he", "pt_PT", "de_AT"];
/**
 * Generate a random locale.
 *
 * @category address
 *
 * @example
 *
 * randLocale()
 *
 * @example
 *
 * randLocale({ length: 10 })
 *
 */

function randLocale(options) {
  return fake(data$Q, options);
}
/**
 * Generate a random longitude.
 *
 * @category address
 *
 * @example
 *
 * randLongitude()
 *
 * @example
 *
 * randLongitude({ length: 10 })
 *
 */


function randLongitude(options) {
  return fake(() => getRandomInRange({
    min: -180,
    max: 180,
    fraction: 3
  }), options);
}
/**
 * Generate a random mac address.
 *
 * @category system
 *
 * @example
 *
 * randMac()
 *
 * @example
 *
 * randMac({ length: 10 })
 *
 */


function randMac(options) {
  return fake(() => Array.from({
    length: 6
  }, () => randHexaDecimal() + randHexaDecimal()).join('-'), options);
}
/**
 * Generate a random mask.
 *
 * @category Finance
 *
 * @example
 *
 * randMask()
 *
 * @example
 *
 * randMask({ mask: '@#### @##' })
 *
 * @example
 *
 * randMask({ length: 10 })
 *
 */


function randMask(options) {
  return fake(() => {
    var _options$mask, _options$char, _options$digit;

    const [mask, char, digit] = [(_options$mask = options == null ? void 0 : options.mask) != null ? _options$mask : '@##@#', (_options$char = options == null ? void 0 : options.char) != null ? _options$char : '@', (_options$digit = options == null ? void 0 : options.digit) != null ? _options$digit : '#'];
    return mask.split('').map(item => {
      if (item === char) return randAlpha();else if (item === digit) return getRandomInRange({
        min: 0,
        max: 9,
        fraction: 0
      });else return item;
    }).join('');
  }, options);
}

var data$P = ["application/vnd.lotus-approach", "application/vnd.wv.csp+wbxml", "application/font-tdpfr", "application/vnd.nokia.iptv.config+xml", "application/vnd.oma.dcdc", "application/vnd.dece.data", "audio/x-flac", "application/vnd.uplanet.channel-wbxml", "application/vnd.fsc.weblaunch", "video/mpv", "application/vnd.framemaker", "application/vnd.gov.sk.e-form+xml", "model/vnd.opengex", "application/metalink+xml", "application/scvp-vp-response", "application/vnd.oipf.mippvcontrolmessage+xml", "multipart/form-data", "application/vnd.umajin", "application/x-bzip", "application/vnd.anser-web-certificate-issue-initiation", "application/ocsp-request", "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml", "video/ogg", "audio/evrcwb0", "application/vnd.font-fontforge-sfd", "application/vnd.openxmlformats-officedocument.presentationml-template", "video/parityfec", "application/vnd.openblox.game+xml", "text/jade", "audio/aptx", "application/vnd.japannet-registration", "application/vnd.pvi.ptid1", "application/vnd.webturbo", "application/vnd.accpac.simply.imp", "application/x-msschedule", "image/vnd.airzip.accelerator.azv", "application/vnd.kenameaapp", "application/vnd.geoplan", "application/vnd.tmd.mediaflex.api+xml", "application/mpeg4-iod", "application/vnd.syncml.dmddf+xml", "application/vnd.cluetrust.cartomobile-config", "application/vnd.radisys.msml-audit-stream+xml", "application/vnd.sus-calendar", "application/samlassertion+xml", "application/vnd.ms-word.document.macroenabled.12", "application/x-shockwave-flash", "application/xcap-error+xml", "video/h264-svc", "multipart/header-set", "image/vnd.adobe.photoshop", "application/pkix-pkipath", "application/mac-compactpro", "text/vnd.fly", "application/vnd.novadigm.edm", "application/vnd.dtg.local.flash", "application/vnd.ecowin.series", "application/vnd.spotfire.dxp", "audio/x-m4a", "text/rtp-enc-aescm128", "audio/pcmu", "multipart/appledouble", "audio/x-wav", "application/vnd.ibm.electronic-media", "text/coffeescript", "application/metalink4+xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml", "audio/1d-interleaved-parityfec", "application/vnd.powerbuilder75", "application/sql", "text/markdown", "text/vnd.dmclientscript", "application/pidf+xml", "application/mbms-msk+xml", "audio/rtp-enc-aescm128", "application/x-font-dos", "application/x-pkcs7-certificates", "application/x-msaccess", "text/x-sass", "application/vnd.dart", "application/vnd.palm", "application/vnd.intergeo", "application/vnd.accpac.simply.aso", "model/vnd.moml+xml", "application/vnd.uplanet.alert-wbxml", "audio/g726-24", "image/vnd.microsoft.icon", "application/vnd.openxmlformats-officedocument.presentationml.comments+xml", "audio/ilbc", "audio/vnd.dts.hd", "audio/l20", "audio/vnd.nuera.ecelp4800", "video/vnd.iptvforum.1dparityfec-2005", "application/vnd.ms-asf", "application/vnd.avistar+xml", "audio/vnd.dolby.pulse.1", "application/vnd.dm.delegation+xml"];
/**
 * Generate a random mime type.
 *
 * @category system
 *
 * @example
 *
 * randMimeType()
 *
 * @example
 *
 * randMimeType({ length: 10 })
 *
 */

function randMimeType(options) {
  return fake(data$P, options);
}

var data$O = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/**
 * Generate a random month.
 *
 * @category date
 *
 * @example
 *
 * randMonth()
 *
 * @example
 *
 * randMonth({ abbreviation: true })
 *
 *
 * @example
 *
 * randMonth({ length: 10 })
 *
 */

function randMonth(options) {
  const monthData = data$O;
  const abbreviation = options == null ? void 0 : options.abbreviation;

  const factory = () => {
    const randMonth = randElement(monthData);

    if (abbreviation) {
      return randMonth.slice(0, 3);
    }

    return randMonth;
  };

  return fake(factory, options);
}

var data$N = ["The Shawshank Redemption", "The Godfather", "The Godfather: Part II", "Pulp Fiction", "The Good, the Bad and the Ugly", "The Dark Knight", "12 Angry Men", "Schindler's List", "The Lord of the Rings: The Return of the King", "Fight Club", "Star Wars: Episode V - The Empire Strikes Back", "The Lord of the Rings: The Fellowship of the Ring", "One Flew Over the Cuckoo's Nest", "Inception", "Goodfellas", "Star Wars", "Seven Samurai", "Forrest Gump", "The Matrix", "The Lord of the Rings: The Two Towers", "City of God", "Se7en", "The Silence of the Lambs", "Once Upon a Time in the West", "Casablanca", "The Usual Suspects", "Raiders of the Lost Ark", "Rear Window", "It's a Wonderful Life", "Psycho", "Léon: The Professional", "Sunset Blvd.", "American History X", "Apocalypse Now", "Terminator 2: Judgment Day", "Saving Private Ryan", "Memento", "City Lights", "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", "Alien", "Modern Times", "Spirited Away", "North by Northwest", "Back to the Future", "Life Is Beautiful", "The Shining", "The Pianist", "Citizen Kane", "The Departed", "M", "Paths of Glory", "Vertigo", "Django Unchained", "Double Indemnity", "The Dark Knight Rises", "Aliens", "Taxi Driver", "American Beauty", "The Green Mile", "Gladiator", "The Intouchables", "WALL·E", "The Lives of Others", "Toy Story 3", "The Great Dictator", "The Prestige", "A Clockwork Orange", "Lawrence of Arabia", "Amélie", "To Kill a Mockingbird", "Reservoir Dogs", "Das Boot", "The Lion King", "Cinema Paradiso", "Star Wars: Episode VI - Return of the Jedi", "The Treasure of the Sierra Madre", "The Third Man", "Once Upon a Time in America", "Requiem for a Dream", "Eternal Sunshine of the Spotless Mind", "Full Metal Jacket", "Oldboy", "Braveheart", "L.A. Confidential", "Bicycle Thieves", "Chinatown", "Singin' in the Rain", "Princess Mononoke", "Monty Python and the Holy Grail", "Metropolis", "Rashomon", "Some Like It Hot", "Amadeus", "2001: A Space Odyssey", "All About Eve", "Witness for the Prosecution", "The Sting", "The Apartment", "Grave of the Fireflies", "Indiana Jones and the Last Crusade"];
/**
 * Generate a random movie.
 *
 * @category Movie
 *
 * @example
 *
 * randMovie()
 *
 * @example
 *
 * randMovie({ length: 10 })
 *
 */

function randMovie(options) {
  return fake(data$N, options);
}

var data$M = ["Darth Vader", "Edna Mode", "Randle McMurphy", "Optimus Prime", "Norman Bates", "The Minions", "Maximus", "Legolas", "Wednesday Addams", "Inspector Clouseau", "Inigo Montoya", "Hal", "Groot", "Gromit", "Ethan Hunt", "Red", "Walker", "Corporal Hicks", "Bane", "Woody", "Withnail", "V", "Roy Batty", "Martin Blank", "Samwise Gamgee", "Private William Hudson", "Lisbeth Salander", "Frank Drebin", "Donnie Darko", "Captain Kirk", "Star-Lord", "Tony Montana", "Marge Gunderson", "Neo", "Harry Potter", "Gollum / Sméagol", "Hans Landa", "George Bailey", "Wolverine", "E.T.", "Bilbo Baggins", "Dr. King Schultz", "Ace Ventura", "Sarah Connor", "Katniss Everdeen", "Jack Burton", "Axel Foley", "Amélie Poulain", "Vito Corleone", "Shaun Riley", "Obi-Wan Kenobi", "Luke Skywalker", "Harry Callahan", "Lester Burnham", "Rick Deckard", "Captain America", "Tommy DeVito", "Anton Chigurh", "Amy Dunne", "Lou Bloom", "Keyser Söze", "Ferris Bueller", "Driver", "Yoda", "Walter Sobchak", "Rocky Balboa", "Atticus Finch", "Captain Mal Reynolds", "The Man With No Name", "Jules Winnfield", "Peter Venkman", "Gandalf", "Snake Plissken", "The Terminator (T-800)", "Forrest Gump", "Patrick Bateman", "Ash", "Daniel Plainview", "The Bride", "Travis Bickle", "Hannibal Lecter", "Doc Brown", "Loki", "Rick Blaine", "M. Gustave", "Ron Burgundy", "Aragorn", "Captain Jack Sparrow", "Iron Man", "Marty McFly", "Michael Corleone", "The Dude", "Tyler Durden", "John McClane", "The Joker", "Ellen Ripley", "Batman", "Han Solo", "James Bond", "Indiana Jones"];
/**
 * Generate a random movie character.
 *
 * @category movie
 *
 * @example
 *
 * randMovieCharacter()
 *
 * @example
 *
 * randMovieCharacter({ length: 10 })
 *
 */

function randMovieCharacter(options) {
  return fake(data$M, options);
}

var data$L = ["Classical", "Reggae", "Blues", "Country", "Latin", "Funk", "Rap", "Folk", "Electronic", "World", "Hip Hop", "Pop", "Stage And Screen", "Soul", "Non Music", "Jazz", "Rock", "Metal"];
/**
 * Generate a random genre.
 *
 * @category music
 *
 * @example
 *
 * randMusicGenre()
 *
 * @example
 *
 * randMusicGenre({ length: 10 })
 *
 */

function randMusicGenre(options) {
  return fake(data$L, options);
}
/**
 * Generate a random GPS coordinate.
 *
 * @category address
 *
 * @example
 *
 * randNearbyGPSCoordinate()
 *
 * @example
 *
 * randNearbyGPSCoordinate({ length: 10 })
 *
 */


function randNearbyGPSCoordinate(options) {
  return fake(() => [randLatitude(), randLongitude()], options);
}

var data$K = ["Amazon", "AOL", "Autodesk", "Apple", "Basecamp", "Battle.net", "Bitbucket", "bitly", "Box", "ClearScore", "Cloud Foundry", "Dailymotion", "Deutsche Telekom", "deviantART", "Discogs", "Discord", "Dropbox", "Etsy", "Evernote", "Facebook", "FatSecret", "Fitbit", "Flickr", "Formstack", "Foursquare", "GitHub", "GitLab", "Goodreads", "Google", "Google App Engine", "Groundspeak", "Huddle", "Imgur", "Instagram", "IntelCloud Services", "Jive Software", "Keycloak", "LinkedIn", "LoginRadius", "Microsoft services", "Mixi", "MySpace", "MoreTeam", "Netflix", "NetIQ", "Okta", "OpenAM", "OpenStreetMap", "OpenTable", "ORCID", "PayPal", "Ping Identity", "Pixiv", "Plurk", "Reddit", "Salesforce.com", "Sina Weibo", "Spotify", "Stack Exchange", "StatusNet", "Strava", "Stripe", "Trello", "Tumblr", "Twitch", "Twitter", "Ubuntu One", "Viadeo", "Vimeo", "VK", "WeChat", "Withings", "WooCommerce", "WordPress.com", "WSO2 Identity Server", "Xero", "XING", "Yahoo!", "Yammer", "Yandex", "Yelp", "Zendesk"];
/**
 * Generate a random OAuth provider.
 *
 * @category Internet
 *
 * @example
 *
 * randOAuthProvider()
 *
 * @example
 *
 * randOAuthProvider({ length: 10 })
 *
 */

function randOAuthProvider(options) {
  return fake(data$K, options);
}
/**
 * Generate a random octal.
 *
 * @category Math
 *
 * @example
 *
 * randOctal()
 *
 * @example
 *
 * randOctal({ length: 10 })
 *
 */


function randOctal(options) {
  const RADIX = 8;
  const randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  return BigInt(randomNumber.toString(RADIX));
}

var data$J = ["Southwest", "Northwest", "Southeast", "Northeast"];
/**
 * Generate a random ordinal direction.
 *
 * @category address
 *
 * @example
 *
 * randOrdinalDirection()
 *
 * @example
 *
 * randOrdinalDirection({ length: 10 })
 *
 */

function randOrdinalDirection(options) {
  return fake(data$J, options);
}

var data$I = ["Quia sit architecto itaque voluptas aliquam. Rem veritatis qui quasi sint velit dolorem maxime voluptatem. Sit aut laboriosam aspernatur dicta non consequatur qui recusandae. Dignissimos voluptatem labore praesentium.", "Eveniet qui aperiam et. Rem incidunt sapiente architecto earum consectetur officia. Assumenda voluptatem sed aperiam sed temporibus sunt in. Totam molestiae aspernatur quia non rem facilis expedita harum veritatis. Culpa ipsam quo dolor.", "Perspiciatis distinctio quia est magni. Aliquid id sed qui quis eum amet ut iusto. Et eos repellat nisi doloremque. Non est aut dolores accusamus pariatur placeat amet dolor.", "Sint doloribus id voluptatem nulla dicta deserunt. Enim exercitationem aut modi saepe numquam ea. Voluptas mollitia non totam tempora delectus tenetur necessitatibus officiis. Odit vero consequatur qui dolorem et. Repellendus quia iure et dolorem.", "Error quos aperiam et dolor et sit occaecati. Qui minima officia pariatur dolorem sit. Et incidunt consequatur eaque unde sunt sit dolore. Et quia ut rerum. Fugit sunt architecto cupiditate voluptas.", "Consequatur praesentium vel optio facilis alias ea nesciunt. Soluta dolores facere eum ea quasi qui. Odit quisquam libero recusandae sit sit sed. Distinctio nihil omnis est sunt.", "Magni fugit perspiciatis aperiam ipsam dolorem minima. Magni ea qui quaerat harum quo repellat eos. Necessitatibus possimus quis fugit aut sed quis asperiores et.", "Perspiciatis illum illum et et error labore ut iure. Eius quidem eius placeat blanditiis in et deserunt. Eligendi fugiat vero nam asperiores sequi sit dignissimos. Quam rerum consequuntur dolor.", "Distinctio facere fugit vel nobis dolor voluptas vel quod in. Molestiae et velit. Maiores voluptatem ut qui eligendi repellat eos quia. Tempore ipsa voluptatem minus. In reiciendis dolorem deserunt consequatur at.", "Consectetur suscipit beatae est ut ut dolorem voluptas. Et sunt ratione. Consequatur illo et architecto.", "Quisquam at dolorem cupiditate enim ut recusandae porro aut quae. In nostrum et velit maiores dolores in architecto natus delectus. Aspernatur possimus libero velit omnis beatae. Libero adipisci et consequatur ullam. Aliquam est nam repudiandae odio. Eligendi vitae in beatae sint saepe ut eaque esse.", "Odit consequatur nobis aut quo dolores in adipisci praesentium. Quod rerum ducimus ad. Ut autem velit consequatur nihil animi animi architecto. Quaerat et sed.", "Vel provident ab nemo rerum consequatur fugiat. Voluptas facilis officia sint ullam omnis qui quis a. Nostrum atque laudantium delectus dolorum quod error.", "Veritatis officiis est occaecati sunt consequatur. Aut sapiente totam sed ad ad qui eum omnis deleniti. Quis blanditiis aperiam.", "Asperiores labore tempore quam. Ut voluptatem unde tempore fuga non repellendus omnis maxime. Quia soluta quibusdam. Commodi animi eum dolorem placeat sit. Quam nihil doloremque eligendi rem quibusdam iusto consequatur quae. Modi quaerat labore laboriosam quaerat sint nulla.", "Provident cumque quos quam enim. Nihil aperiam nihil ut. Blanditiis enim officia omnis quo tenetur aliquid odio et. Perspiciatis unde officiis ea expedita id dolorem. Quam nihil et amet quos et fugit. Cum voluptatem tempora deserunt.", "Ipsa nemo eos sequi nulla id accusamus nam ratione dolore. Omnis sint quisquam accusamus rem rem nihil. Non minus animi cum dolorem earum odit sequi. Rem non inventore sed dicta atque modi. Sed dolorem iste molestiae. Sed eum iste aliquid aliquid.", "Et quod ad optio culpa dicta at eveniet. Deserunt perferendis debitis sunt aut. Laboriosam laboriosam aspernatur id corporis.", "Et atque sunt ab esse excepturi ut quos delectus. Possimus dolor assumenda dicta sapiente quaerat nisi sed consequatur hic. In dolorem eos ut eum nam accusantium iure. Ipsam laborum deleniti ut.", "Et id harum unde et ratione minima non. Suscipit ipsum rem. Sed asperiores quaerat dolorum autem nihil voluptatem et hic ut. Molestiae rerum autem. Dolores nam soluta officia pariatur debitis.", "Alias esse minus. Molestiae et ut dolores iste. Nam sint aut. Explicabo ut earum modi accusamus facilis rerum.", "Sint id odit. Tenetur sit in deserunt voluptatem corporis voluptatum culpa eligendi. Est quia reprehenderit atque modi. Ipsum quo eos deserunt nobis.", "Molestias in reprehenderit molestias quam doloribus tenetur. Cupiditate enim ad est nemo et quos. Minus non et voluptatem magni voluptatibus consectetur temporibus ad. Molestiae sed voluptate et dolor eaque sequi minima. Quisquam atque distinctio culpa distinctio rerum labore vero assumenda voluptate.", "Quas quidem dolores eum aspernatur tempore illo deserunt veniam sed. Non est molestias omnis dolorem doloremque et exercitationem odit itaque. Aliquid nam eos rem maiores exercitationem similique rerum voluptatem voluptas. Dolor rerum ea hic esse inventore.", "Distinctio adipisci ex. Temporibus esse error ea aut est temporibus. Sunt laudantium recusandae. Soluta culpa nihil nemo sunt et repellat sapiente distinctio. Nostrum accusamus doloribus repellat blanditiis labore.", "Esse omnis enim odit. Veniam sed iusto. Voluptas libero accusamus. Corporis consequatur ut voluptas corporis blanditiis laudantium consequatur ea ducimus. Incidunt incidunt molestiae.", "Dignissimos nesciunt suscipit beatae et eveniet omnis voluptatum natus. Iusto minima commodi rem et a rerum asperiores. Fugit tenetur ut at aut molestias.", "Optio consectetur rerum eos reiciendis. Voluptatem hic iure. Unde aut voluptas.", "Culpa ipsa voluptatem suscipit ut omnis omnis iste. Molestias facere facilis delectus vel fugit quibusdam saepe. Vel ut et dignissimos fugiat sint aut magnam. Quis maiores harum aliquid modi consequuntur veniam ipsum quaerat. Quam quo iusto nulla. Et quasi qui dolore enim.", "Exercitationem similique magni voluptates. Amet et asperiores quidem error. Commodi nostrum hic suscipit fuga consequatur nobis veritatis sit.", "Quaerat officia voluptatum officiis. Quo velit numquam qui sint voluptatem eos magnam quas hic. Excepturi reprehenderit totam reprehenderit et fugit dolorum perferendis est. Quae repudiandae quisquam veniam maxime qui. Rerum aut dolores voluptates corrupti modi ducimus pariatur error tempore.", "Sed quam quo nesciunt et laboriosam. Aspernatur et eum voluptas nesciunt omnis distinctio occaecati eum aut. Occaecati mollitia et est. Reiciendis dolor et ut commodi est repellat ipsa iure. Minus laudantium ut sed earum odit. Laudantium et non iusto et aliquid.", "Repellat illo sunt cum. Maiores et iure. Accusantium eum quo ullam minus architecto aut nulla rerum. Non quis nisi omnis eos dolores quia. Beatae nihil hic ut necessitatibus id fugiat.", "Non consequuntur ut voluptatum. Dicta omnis architecto iure perspiciatis veritatis itaque dolore. Quos necessitatibus dolor nam.", "Et ipsam distinctio quia quia ipsum dignissimos autem assumenda qui. Vel earum harum provident consequatur. Neque animi architecto ratione. Veniam porro possimus nisi voluptas.", "Aut facilis qui. Cupiditate sit ratione eum sunt rerum impedit. Qui suscipit debitis et et voluptates voluptatem voluptatibus. Quas voluptatum quae corporis corporis possimus.", "Et illo dolor cupiditate beatae. Eius eum recusandae odit placeat. Quibusdam error quisquam culpa pariatur praesentium et.", "Consequatur perferendis itaque dolor corporis vel voluptatem quaerat. Ex numquam sed. Reiciendis eveniet ducimus nobis et necessitatibus qui. Sit veritatis temporibus nostrum eius laborum voluptatum deleniti optio. Aperiam vel laborum eos odit ut veritatis. Eos tempora enim sed.", "Est iste totam accusamus dolorem est. Quis non sit impedit similique incidunt odio aspernatur aut rem. Architecto est eum.", "Aperiam autem non et aut illum ut nihil laborum omnis. Vitae et ab et. Cupiditate et est delectus. Mollitia qui qui dolores reiciendis perferendis voluptates maiores. Omnis corporis cumque sequi sequi excepturi velit laborum nobis. Neque id maiores voluptatem est debitis.", "Recusandae id nemo ut amet quas voluptas. Quas vero et molestiae esse. Eum qui quia nulla. Cum ipsa aut voluptate et iste ut porro adipisci. Quisquam error sed quasi voluptates ea nobis consequatur explicabo.", "Sunt velit facere fuga et voluptas inventore itaque. Necessitatibus ratione in esse. Quasi dignissimos quia est sequi incidunt enim reiciendis. At omnis iure in doloremque. Aut tempore consequatur facilis est ut distinctio est quas. Autem sunt est saepe quasi sed reprehenderit error magnam.", "Aliquid rerum tenetur exercitationem enim nihil laboriosam. Ut sequi sit dicta sequi non voluptatibus molestias rerum laudantium. Dolores beatae aut ipsa aut. Ut porro consequatur inventore praesentium quis. Omnis enim in voluptatem voluptatem quia.", "Tempora sunt enim. Sint ullam deleniti ut. Consequatur unde error odio quod fugit. Expedita unde commodi ratione sequi velit. Qui reprehenderit et tempora tenetur rerum. Veritatis consequatur odit sequi explicabo.", "Praesentium consequatur ut sit vel. Molestias fugiat quis cupiditate ipsa eos fugit est ullam. Sit labore et natus dolores ut quis eaque cupiditate. Et ut et et autem assumenda animi autem. Pariatur amet consequatur necessitatibus consequatur consequatur et explicabo sint. Nam sit dolore.", "Corporis distinctio delectus a ipsam commodi voluptas. Facilis minus sit numquam. Iusto quod consequatur molestias dolore dolor atque quidem distinctio. Voluptatem hic debitis sint ut sed recusandae qui consequatur. Nulla veritatis est.", "Deleniti dolor aliquam qui saepe officia nisi. Omnis sit molestiae ea rerum ratione. Dolorum ut corporis eligendi id dolorem totam et architecto voluptatem. Laudantium et vel. Dolores laborum sed quis sed et soluta. Et odio voluptate amet.", "Veniam commodi autem voluptatibus eos dolor quas reprehenderit. Praesentium cupiditate tempore et reprehenderit. Deleniti exercitationem illum maiores. Reprehenderit odio in ea voluptatem ut ut ullam.", "Labore corporis blanditiis dolorum nemo nam praesentium alias sequi inventore. Cupiditate rerum enim sint quis. Eum occaecati provident labore veniam deserunt vero sed soluta repellat. Cum sapiente pariatur et ea a recusandae et optio. Sequi doloribus reiciendis corrupti quidem accusamus est nesciunt. Excepturi accusamus consequatur est sed maiores excepturi autem.", "Assumenda molestiae laboriosam enim ipsum quaerat enim officia vel quo. Earum odit rem natus totam atque cumque. Sint dolorem facere non.", "Aut facere quaerat sapiente inventore libero impedit vero. Animi harum assumenda autem sint necessitatibus fugiat. Qui eligendi et ut distinctio.", "Vel amet eos voluptatibus vel expedita accusantium molestiae illo exercitationem. Assumenda ea voluptatem rerum. Accusantium sed totam aut et.", "Accusantium aliquid non neque dicta eum. Molestias nesciunt odit. Quis rerum et cumque distinctio a pariatur vel ea dicta.", "Tempora id non maxime. Qui qui dignissimos omnis adipisci qui. Voluptatibus ut labore est quisquam consequuntur fugiat harum tenetur est. Repellendus quisquam quaerat error nobis voluptatem nihil minima. Autem aliquid ut adipisci officia eos atque excepturi.", "Cupiditate voluptas cumque aspernatur. Adipisci voluptatibus vel eos. Doloremque commodi aliquid occaecati quia provident. Voluptatem tempore doloribus architecto rem quidem quaerat ipsam possimus. Laboriosam quisquam aut illo necessitatibus quo ducimus. Eum cupiditate sint a placeat dolores nemo.", "Beatae officiis nihil similique soluta non voluptas totam ad. Quam nobis enim vel qui ratione quos voluptatem molestiae est. Ipsum voluptate illo aliquid beatae blanditiis dolorem. Adipisci non libero laudantium. A aperiam distinctio tempora aspernatur.", "Eligendi corrupti occaecati et. Laboriosam molestiae dolore laborum consequuntur dolorem sit qui sit. Et placeat voluptas repudiandae expedita et. Dolores aut incidunt iure qui enim et quo fuga.", "Eos necessitatibus officia quos. Et vitae aliquid autem occaecati repudiandae placeat repellat odit. Minus iure voluptates autem quam dicta. Iste consequatur aspernatur voluptas quibusdam sint beatae.", "In reprehenderit esse id ut quas cupiditate error sit. Eum nostrum libero facilis quis error consectetur. Totam porro ut similique aut sint enim amet enim. Harum quo est repudiandae doloribus.", "Quis error sunt. Tempora magnam consequatur. Eum repellendus beatae dolores hic ut placeat voluptas commodi. Amet aliquid vero. Ullam ratione architecto.", "Inventore natus explicabo qui adipisci laborum voluptate molestias suscipit. Ullam quisquam assumenda nesciunt voluptatem in. Similique facere debitis mollitia autem fugit a quo et impedit.", "Vel facere dolorem sit hic non. Veniam nihil cumque sed et delectus. Maiores minus quisquam nostrum. Eius quasi nostrum. Molestiae recusandae ut. Suscipit natus aliquam eos sit aut.", "Incidunt accusamus vero. Ipsam reiciendis unde voluptatibus voluptates ab aliquam aut. Aut voluptas laudantium. Voluptatem beatae explicabo et eius. Commodi a autem omnis.", "Placeat tenetur ut enim similique et nam commodi. Dolores culpa enim. Fuga aliquid voluptatem repellat.", "Rerum enim tenetur maiores ullam et id assumenda est magnam. At praesentium molestias culpa fugiat et ipsum velit est et. Non velit ipsum quas laudantium accusantium sed qui id. Eum deserunt ratione veniam.", "Tempore explicabo laborum laboriosam officia velit aspernatur dolor cupiditate aperiam. Ab aliquid est. Veniam eius vel id rerum quisquam illo voluptates id.", "Quaerat veritatis tempora. Consectetur id fuga iusto voluptas quibusdam est. Et aut dolor est. Sunt mollitia libero.", "Voluptatem ipsa delectus corporis necessitatibus et et et eos debitis. Doloremque enim dolorum. Exercitationem ratione pariatur ut temporibus et est distinctio. Doloremque exercitationem dolores excepturi praesentium ut esse ut dolorum laboriosam. Itaque non aut quos nesciunt voluptatem voluptatem cupiditate.", "Tenetur doloremque at fuga eligendi mollitia modi placeat. Dolores corrupti repellendus et quos eos modi sunt. Quae non molestiae earum iusto magni. Molestiae quo fugit quisquam sed. Quia culpa rem minus distinctio.", "Molestias fugit perspiciatis voluptatem nihil assumenda doloribus. Reiciendis et aperiam ea fugiat ipsum atque omnis qui. Doloribus officiis quisquam optio nihil. Minus iure consequatur fugit quidem quae. Sit et ducimus culpa voluptatum officiis fugiat.", "Cupiditate eos ratione aperiam fuga temporibus. Ut nulla aliquid. Eos dolores eaque. Itaque est nostrum consequuntur sapiente qui delectus unde. Et ut et aut qui a ut ducimus ut. Mollitia quis rem dolorum in pariatur id velit.", "Ducimus omnis numquam. Eos ut quis. Autem numquam nihil ut quo est nam eius. Laboriosam sint nihil in dolorum et recusandae est. Inventore consequuntur at ratione dolores quas doloribus autem et. Qui atque delectus consectetur praesentium doloribus corporis expedita soluta.", "Quo voluptatem quia numquam laudantium sit quibusdam aut. Veritatis omnis neque ea saepe hic enim. Nam odit dolor non consequuntur perspiciatis inventore ut sint. Velit quod praesentium adipisci modi.", "Deserunt laboriosam quas autem repellat aspernatur ipsa accusamus pariatur deserunt. Nam aut eum vel ut. Sunt dicta id eveniet minus. Debitis temporibus quod.", "Ea aut aut sit. Incidunt ut quisquam laborum molestiae temporibus aut quam non. Voluptatibus quia laudantium et et quis quae voluptas accusantium. Doloremque in ab. Illo alias aut.", "Et veritatis rerum. Omnis repellat quo. Provident omnis consequatur provident tempore assumenda assumenda ducimus.", "Est sed deserunt eligendi in velit saepe. Dolorem quis illo vero qui ut recusandae occaecati dolores quae. Voluptatem vero aliquam alias adipisci reiciendis odit nobis est. Vel laboriosam quia commodi rerum. Voluptatum et sed et nesciunt iure ipsum iste aut enim.", "Corrupti aspernatur minus eum. Nihil omnis fuga doloremque eius ipsam saepe impedit. Nobis odio omnis laboriosam similique nostrum voluptas magnam commodi at. Magnam quibusdam dolore. Dolorem minima neque est amet voluptate explicabo similique quos. Rerum esse pariatur.", "Vel et molestiae quis ea modi quas tempore dolorum fuga. Aut dolore numquam et. Amet sit quibusdam ea blanditiis consectetur velit.", "Rerum aut expedita ad nam rerum. Animi sed in sunt enim. Rerum aspernatur ipsam quia consequatur sit est excepturi quidem voluptatem. Eum est et autem ducimus eius quod ipsa officia vero.", "Unde est nesciunt consequuntur magnam quo quia et fugiat. Totam sapiente iure eaque. Ut praesentium quisquam dolorem animi quibusdam quo nostrum facilis. Quasi quos et beatae architecto perferendis. Et laudantium officiis autem aut dolor iure et omnis.", "Similique molestiae id officia corporis quidem. Aliquam et ut eos ut nemo est voluptatem. Possimus ut quo labore. Alias amet quia enim. Quia ipsum pariatur facere illum esse recusandae veniam. Nihil enim fugit porro nam et quis sunt.", "Quis repellendus aspernatur magni non temporibus officiis et aliquid ut. Voluptas consectetur voluptatibus quos quas illo unde. Alias voluptas est. Inventore occaecati sed id minima fuga enim amet. Voluptatibus eius dolorum quam natus consectetur repellat rerum. Incidunt nisi hic consequatur iste iste velit.", "Minima soluta sed sed et optio explicabo at distinctio repudiandae. Magnam deleniti a ea. Non velit accusamus veniam qui. Necessitatibus velit ad aut officiis in officiis quasi. Sunt nulla dolores voluptatem esse magnam ut.", "Consequuntur nihil a id. Consequatur est cum excepturi aut labore odit quo molestiae molestiae. Soluta voluptatem ducimus cupiditate. Dolorum eveniet aliquid aut repudiandae et illo et. Harum unde ut harum accusamus suscipit quia.", "Omnis perspiciatis qui quia commodi sequi modi. Nostrum quam aut cupiditate est facere omnis possimus. Tenetur similique nemo illo soluta molestias facere quo. Ipsam totam facilis delectus nihil quidem soluta vel est omnis.", "Ea hic voluptatum omnis dolorum pariatur sed illo ea. Praesentium veniam vitae pariatur quae. Optio aspernatur aut ut recusandae.", "Ea tempora qui. Aut deserunt dolorum laborum rerum vel. Omnis et ut deserunt minima soluta adipisci sed voluptas.", "Dolor officia a fuga omnis sit. Ut atque est nostrum. Quos aut quo eos vel velit autem et aspernatur.", "Quo nihil assumenda corrupti nobis provident tenetur et. Molestiae unde explicabo nihil maxime. Quidem molestiae velit laborum amet rerum tenetur. Error non aspernatur suscipit asperiores voluptas ipsa dolor. Similique itaque omnis.", "Ut a voluptas labore et dolores magnam. Dolor deleniti dolores temporibus non autem. Voluptatibus numquam reiciendis nesciunt ipsa numquam enim. Unde velit optio quia.", "Libero quod eius. Ad libero qui omnis. Laudantium ut aperiam est exercitationem qui soluta aut ullam. Est dicta veniam voluptas est perspiciatis rerum. Alias ut autem est illo.", "Possimus molestiae mollitia alias reprehenderit autem saepe est odio qui. Odit est quos. Corrupti similique harum reiciendis. Placeat est at aut quo. Laudantium qui voluptatem nemo accusamus minima. Perferendis quos architecto repellat sed id quae iusto.", "Pariatur ut dolor repellendus dolores ut debitis. Est iusto neque dicta voluptatibus quia nulla consequatur. Omnis aut sed dolores qui laborum a amet.", "Veritatis fuga sit ut explicabo ab eos repellendus. Ipsa praesentium dolor. Tempora ipsum est dolorum nihil.", "Rerum quisquam qui repellendus totam nemo nihil odio. Tempore quam non vel molestiae veniam rem necessitatibus. Voluptas commodi recusandae vel illum eveniet ex. Dolore facilis illum atque explicabo.", "Ut quidem et. Quo assumenda et cumque molestias atque sint qui modi. Velit qui dolore possimus totam qui blanditiis. Vel quia consequatur aliquid corrupti qui libero.", "Est quo facilis voluptas aperiam. Natus dolores quas ratione enim repellendus. Illum dolor repellendus voluptas.", "Eveniet quae minus vero praesentium eos fugit explicabo et. Libero at ea ut sapiente et nesciunt odio similique vel. Libero aliquam tempore corporis eveniet dolorum nihil maiores veritatis. Harum modi sint officia.", "Repellendus et iste dolorem iste et perspiciatis occaecati vero eius. Vel ipsa officia quidem in maiores. Fugiat similique aliquam est eveniet ullam laborum qui. Et a maxime et magnam in."];
/**
 * Generate a random paragraph.
 *
 * @category text
 *
 * @example
 *
 * randJobTitle()
 *
 * @example
 *
 * randJobTitle({ length: 10 })
 *
 */

function randParagraph(options) {
  return fake(data$I, options);
}
/**
 * Generate a random password.
 *
 * @category person
 *
 * @example
 *
 * randPassword()
 *
 * @example
 *
 * randPassword({ length: 10 })
 *
 * @example
 *
 * randPassword({ size: 10 }) // default is 15
 *
 */


function randPassword(options) {
  const size = (options == null ? void 0 : options.size) || 15;
  return fake(() => randSequence({
    size
  }), options);
}
/**
 * Generate a random past date.
 *
 * @category date
 *
 * @example
 *
 * randPastDate()
 *
 * @example
 *
 * randPastDate({ length: 10 })
 *
 * @example
 *
 * randPastDate({ years: 2 }) // default is 1
 *
 */


function randPastDate(options) {
  var _options$years;

  const years = (_options$years = options == null ? void 0 : options.years) != null ? _options$years : 1;

  if (years <= 0) {
    throw new Error('Years must be positive, use future() instead');
  }

  const yearsInMilliseconds = years * 365 * 24 * 60 * 60 * 1000;
  const to = new Date();
  const from = new Date(to.getTime() - yearsInMilliseconds);
  return fake(() => randBetweenDate({
    from,
    to
  }), options);
}

var data$H = ["read", "write", "execute", "no permission"];
/**
 * Generate a random permission.
 *
 * @category system
 *
 * @example
 *
 * randPermission()
 *
 * @example
 *
 * randPermission({ length: 10 })
 *
 * @example
 *
 * randPermission({ numeric: true })
 *
 */

function randPermission(options) {
  if (options != null && options.numeric) {
    return fake([0, 1, 2, 4], options);
  }

  return fake(data$H, options);
}

var data$G = ["Dr.", "Miss", "Mr.", "Mrs.", "Ms."];
/**
 * Generate a random person title.
 *
 * @category person
 *
 * @example
 *
 * randPersonTitle()
 *
 * @example
 *
 * randPersonTitle({ length: 10 })
 *
 */

function randPersonTitle(options) {
  return fake(data$G, options);
}

var data$F = [{
  formats: ["+247 ####"],
  countryCode: ["AC"]
}, {
  formats: ["+376 ### ###"],
  countryCode: ["AD"]
}, {
  formats: ["+971 ## ### ####", "+971 # ### ####"],
  countryCode: ["AE"]
}, {
  formats: ["+93 ## ### ####"],
  countryCode: ["AF"]
}, {
  formats: ["+1(268)### ####"],
  countryCode: ["AG"]
}, {
  formats: ["+1(264)### ####"],
  countryCode: ["AI"]
}, {
  formats: ["+355(###)### ###"],
  countryCode: ["AL"]
}, {
  formats: ["+374 ## ### ###"],
  countryCode: ["AM"]
}, {
  formats: ["+599 ### ####", "+599 9### ####"],
  countryCode: ["AN"]
}, {
  formats: ["+244(###)### ###"],
  countryCode: ["AO"]
}, {
  formats: ["+672 1## ###"],
  countryCode: ["AQ"]
}, {
  formats: ["+54(###)### ####"],
  countryCode: ["AR"]
}, {
  formats: ["+1(684)### ####"],
  countryCode: ["AS"]
}, {
  formats: ["+43(###)### ####"],
  countryCode: ["AT"]
}, {
  formats: ["+61 # #### ####"],
  countryCode: ["AU"]
}, {
  formats: ["+297 ### ####"],
  countryCode: ["AW"]
}, {
  formats: ["+994 ## ### ## ##"],
  countryCode: ["AZ"]
}, {
  formats: ["+387 ## #####", "+387 ## ####"],
  countryCode: ["BA"]
}, {
  formats: ["+1(246)### ####"],
  countryCode: ["BB"]
}, {
  formats: ["+880 ## ### ###"],
  countryCode: ["BD"]
}, {
  formats: ["+32(###)### ###"],
  countryCode: ["BE"]
}, {
  formats: ["+226 ## ## ####"],
  countryCode: ["BF"]
}, {
  formats: ["+359(###)### ###"],
  countryCode: ["BG"]
}, {
  formats: ["+973 #### ####"],
  countryCode: ["BH"]
}, {
  formats: ["+257 ## ## ####"],
  countryCode: ["BI"]
}, {
  formats: ["+229 ## ## ####"],
  countryCode: ["BJ"]
}, {
  formats: ["+1(441)### ####"],
  countryCode: ["BM"]
}, {
  formats: ["+673 ### ####"],
  countryCode: ["BN"]
}, {
  formats: ["+591 # ### ####"],
  countryCode: ["BO"]
}, {
  formats: ["+55 ## #### ####", "+55 ## ##### ####"],
  countryCode: ["BR"]
}, {
  formats: ["+1(242)### ####"],
  countryCode: ["BS"]
}, {
  formats: ["+975 17 ### ###", "+975 # ### ###"],
  countryCode: ["BT"]
}, {
  formats: ["+267 ## ### ###"],
  countryCode: ["BW"]
}, {
  formats: ["+375(##)### ## ##"],
  countryCode: ["BY"]
}, {
  formats: ["+501 ### ####"],
  countryCode: ["BZ"]
}, {
  formats: ["+243(###)### ###"],
  countryCode: ["CD"]
}, {
  formats: ["+236 ## ## ####"],
  countryCode: ["CF"]
}, {
  formats: ["+242 ## ### ####"],
  countryCode: ["CG"]
}, {
  formats: ["+41 ## ### ####"],
  countryCode: ["CH"]
}, {
  formats: ["+225 ## ### ###"],
  countryCode: ["CI"]
}, {
  formats: ["+682 ## ###"],
  countryCode: ["CK"]
}, {
  formats: ["+56 # #### ####"],
  countryCode: ["CL"]
}, {
  formats: ["+237 #### ####"],
  countryCode: ["CM"]
}, {
  formats: ["+86(###)#### ####", "+86(###)#### ###", "+86 ## ##### #####"],
  countryCode: ["CN"]
}, {
  formats: ["+57(###)### ####"],
  countryCode: ["CO"]
}, {
  formats: ["+506 #### ####"],
  countryCode: ["CR"]
}, {
  formats: ["+53 # ### ####"],
  countryCode: ["CU"]
}, {
  formats: ["+238(###)## ##"],
  countryCode: ["CV"]
}, {
  formats: ["+599 ### ####"],
  countryCode: ["CW"]
}, {
  formats: ["+357 ## ### ###"],
  countryCode: ["CY"]
}, {
  formats: ["+420(###)### ###"],
  countryCode: ["CZ"]
}, {
  formats: ["+49(####)### ####", "+49(###)### ####", "+49(###)## ####", "+49(###)## ###", "+49(###)## ##", "+49 ### ###"],
  countryCode: ["DE"]
}, {
  formats: ["+253 ## ## ## ##"],
  countryCode: ["DJ"]
}, {
  formats: ["+45 ## ## ## ##"],
  countryCode: ["DK"]
}, {
  formats: ["+1(767)### ####"],
  countryCode: ["DM"]
}, {
  formats: ["+1(809)### ####", "+1(829)### ####", "+1(849)### ####"],
  countryCode: ["DO"]
}, {
  formats: ["+213 ## ### ####"],
  countryCode: ["DZ"]
}, {
  formats: ["+593 ## ### ####", "+593 # ### ####"],
  countryCode: ["EC"]
}, {
  formats: ["+372 #### ####", "+372 ### ####"],
  countryCode: ["EE"]
}, {
  formats: ["+20(###)### ####"],
  countryCode: ["EG"]
}, {
  formats: ["+291 # ### ###"],
  countryCode: ["ER"]
}, {
  formats: ["+34(###)### ###"],
  countryCode: ["ES"]
}, {
  formats: ["+251 ## ### ####"],
  countryCode: ["ET"]
}, {
  formats: ["+358(###)### ## ##"],
  countryCode: ["FI"]
}, {
  formats: ["+679 ## #####"],
  countryCode: ["FJ"]
}, {
  formats: ["+500 #####"],
  countryCode: ["FK"]
}, {
  formats: ["+691 ### ####"],
  countryCode: ["FM"]
}, {
  formats: ["+298 ### ###"],
  countryCode: ["FO"]
}, {
  formats: ["+262 ##### ####", "+33 1 ## ## ## ##", "+33 2 ## ## ## ##", "+33 3 ## ## ## ##", "+33 4 ## ## ## ##", "+33 5 ## ## ## ##", "+33 6 ## ## ## ##", "+33 7 ## ## ## ##", "+508 ## ####", "+590(###)### ###"],
  countryCode: ["FR"]
}, {
  formats: ["+241 # ## ## ##"],
  countryCode: ["GA"]
}, {
  formats: ["+1(473)### ####"],
  countryCode: ["GD"]
}, {
  formats: ["+995(###)### ###"],
  countryCode: ["GE"]
}, {
  formats: ["+594 ##### ####"],
  countryCode: ["GF"]
}, {
  formats: ["+233(###)### ###"],
  countryCode: ["GH"]
}, {
  formats: ["+350 ### #####"],
  countryCode: ["GI"]
}, {
  formats: ["+299 ## ## ##"],
  countryCode: ["GL"]
}, {
  formats: ["+220(###)## ##"],
  countryCode: ["GM"]
}, {
  formats: ["+224 ## ### ###"],
  countryCode: ["GN"]
}, {
  formats: ["+240 ## ### ####"],
  countryCode: ["GQ"]
}, {
  formats: ["+30(###)### ####"],
  countryCode: ["GR"]
}, {
  formats: ["+502 # ### ####"],
  countryCode: ["GT"]
}, {
  formats: ["+1(671)### ####"],
  countryCode: ["GU"]
}, {
  formats: ["+245 # ######"],
  countryCode: ["GW"]
}, {
  formats: ["+592 ### ####"],
  countryCode: ["GY"]
}, {
  formats: ["+852 #### ####"],
  countryCode: ["HK"]
}, {
  formats: ["+504 #### ####"],
  countryCode: ["HN"]
}, {
  formats: ["+385 (##) ### ###", "+385 (##) ### ####", "+385 1 #### ###"],
  countryCode: ["HR"]
}, {
  formats: ["+509 ## ## ####"],
  countryCode: ["HT"]
}, {
  formats: ["+36(###)### ###"],
  countryCode: ["HU"]
}, {
  formats: ["+62(8##)### ####", "+62(8##)### ###", "+62(8##)### ## ###", "+62 ## ### ##", "+62 ## ### ###", "+62 ## ### ####"],
  countryCode: ["ID"]
}, {
  formats: ["+353(###)### ###"],
  countryCode: ["IE"]
}, {
  formats: ["+972 5# ### ####", "+972 # ### ####"],
  countryCode: ["IL"]
}, {
  formats: ["+91 ##### #####"],
  countryCode: ["IN"]
}, {
  formats: ["+246 ### ####"],
  countryCode: ["IO"]
}, {
  formats: ["+964(###)### ####"],
  countryCode: ["IQ"]
}, {
  formats: ["+98(###)### ####"],
  countryCode: ["IR"]
}, {
  formats: ["+354 ### ####"],
  countryCode: ["IS"]
}, {
  formats: ["+39(0##)#### ## ##", "+39(0##)#### ###", "+39(0##)### ###", "+39(0##)## ###", "+39(0##)## ##", "+39(0#)## ##", "+39(3##)### ## ##", "+39(3##)## ## ##"],
  countryCode: ["IT"]
}, {
  formats: ["+1(876)### ####"],
  countryCode: ["JM"]
}, {
  formats: ["+962 # #### ####"],
  countryCode: ["JO"]
}, {
  formats: ["+81 ## #### ####", "+81(###)### ###"],
  countryCode: ["JP"]
}, {
  formats: ["+254 ### ######"],
  countryCode: ["KE"]
}, {
  formats: ["+996(###)### ###"],
  countryCode: ["KG"]
}, {
  formats: ["+855 ## ### ###"],
  countryCode: ["KH"]
}, {
  formats: ["+686 ## ###"],
  countryCode: ["KI"]
}, {
  formats: ["+269 ## #####"],
  countryCode: ["KM"]
}, {
  formats: ["+1(869)### ####"],
  countryCode: ["KN"]
}, {
  formats: ["+850 191 ### ####", "+850 ## ### ###", "+850 ### #### ###", "+850 ### ###", "+850 #### ####", "+850 #### #############"],
  countryCode: ["KP"]
}, {
  formats: ["+82 ## ### ####"],
  countryCode: ["KR"]
}, {
  formats: ["+965 #### ####"],
  countryCode: ["KW"]
}, {
  formats: ["+1(345)### ####"],
  countryCode: ["KY"]
}, {
  formats: ["+7(6##)### ## ##", "+7(7##)### ## ##"],
  countryCode: ["KZ"]
}, {
  formats: ["+856(20##)### ###", "+856 ## ### ###"],
  countryCode: ["LA"]
}, {
  formats: ["+961 ## ### ###", "+961 # ### ###"],
  countryCode: ["LB"]
}, {
  formats: ["+1(758)### ####"],
  countryCode: ["LC"]
}, {
  formats: ["+423(###)### ####"],
  countryCode: ["LI"]
}, {
  formats: ["+94 ## ### ####"],
  countryCode: ["LK"]
}, {
  formats: ["+231 ## ### ###"],
  countryCode: ["LR"]
}, {
  formats: ["+266 # ### ####"],
  countryCode: ["LS"]
}, {
  formats: ["+370(###)## ###"],
  countryCode: ["LT"]
}, {
  formats: ["+352 ### ###", "+352 #### ###", "+352 ##### ###", "+352 ###### ###"],
  countryCode: ["LU"]
}, {
  formats: ["+371 ## ### ###"],
  countryCode: ["LV"]
}, {
  formats: ["+218 ## ### ###", "+218 21 ### ####"],
  countryCode: ["LY"]
}, {
  formats: ["+212 ## #### ###"],
  countryCode: ["MA"]
}, {
  formats: ["+377(###)### ###", "+377 ## ### ###"],
  countryCode: ["MC"]
}, {
  formats: ["+373 #### ####"],
  countryCode: ["MD"]
}, {
  formats: ["+382 ## ### ###"],
  countryCode: ["ME"]
}, {
  formats: ["+261 ## ## #####"],
  countryCode: ["MG"]
}, {
  formats: ["+692 ### ####"],
  countryCode: ["MH"]
}, {
  formats: ["+389 ## ### ###"],
  countryCode: ["MK"]
}, {
  formats: ["+223 ## ## ####"],
  countryCode: ["ML"]
}, {
  formats: ["+95 ## ### ###", "+95 # ### ###", "+95 ### ###"],
  countryCode: ["MM"]
}, {
  formats: ["+976 ## ## ####"],
  countryCode: ["MN"]
}, {
  formats: ["+853 #### ####"],
  countryCode: ["MO"]
}, {
  formats: ["+1(670)### ####"],
  countryCode: ["MP"]
}, {
  formats: ["+596(###)## ## ##"],
  countryCode: ["MQ"]
}, {
  formats: ["+222 ## ## ####"],
  countryCode: ["MR"]
}, {
  formats: ["+1(664)### ####"],
  countryCode: ["MS"]
}, {
  formats: ["+356 #### ####"],
  countryCode: ["MT"]
}, {
  formats: ["+230 ### ####"],
  countryCode: ["MU"]
}, {
  formats: ["+960 ### ####"],
  countryCode: ["MV"]
}, {
  formats: ["+265 1 ### ###", "+265 # #### ####"],
  countryCode: ["MW"]
}, {
  formats: ["+52(###)### ####", "+52 ## ## ####"],
  countryCode: ["MX"]
}, {
  formats: ["+60 ## ### ####", "+60 11 #### ####", "+60(###)### ###", "+60 ## ### ###", "+60 # ### ###"],
  countryCode: ["MY"]
}, {
  formats: ["+258 ## ### ###"],
  countryCode: ["MZ"]
}, {
  formats: ["+264 ## ### ####"],
  countryCode: ["NA"]
}, {
  formats: ["+687 ## ####"],
  countryCode: ["NC"]
}, {
  formats: ["+227 ## ## ####"],
  countryCode: ["NE"]
}, {
  formats: ["+672 3## ###"],
  countryCode: ["NF"]
}, {
  formats: ["+234(###)### ####", "+234 ## ### ###", "+234 ## ### ##", "+234(###)### ####"],
  countryCode: ["NG"]
}, {
  formats: ["+505 #### ####"],
  countryCode: ["NI"]
}, {
  formats: ["+31 ## ### ####"],
  countryCode: ["NL"]
}, {
  formats: ["+47(###)## ###"],
  countryCode: ["NO"]
}, {
  formats: ["+977 ## ### ###"],
  countryCode: ["NP"]
}, {
  formats: ["+674 ### ####"],
  countryCode: ["NR"]
}, {
  formats: ["+683 ####"],
  countryCode: ["NU"]
}, {
  formats: ["+64(###)### ###[#]", "+64 ## ### ###"],
  countryCode: ["NZ"]
}, {
  formats: ["+968 ## ### ###"],
  countryCode: ["OM"]
}, {
  formats: ["+507 ### ####"],
  countryCode: ["PA"]
}, {
  formats: ["+51(###)### ###"],
  countryCode: ["PE"]
}, {
  formats: ["+689 ## ## ##"],
  countryCode: ["PF"]
}, {
  formats: ["+675(###)## ###"],
  countryCode: ["PG"]
}, {
  formats: ["+63(###)### ####"],
  countryCode: ["PH"]
}, {
  formats: ["+92(###)### ####"],
  countryCode: ["PK"]
}, {
  formats: ["+48(###)### ###"],
  countryCode: ["PL"]
}, {
  formats: ["+970 ## ### ####"],
  countryCode: ["PS"]
}, {
  formats: ["+351 ## ### ####"],
  countryCode: ["PT"]
}, {
  formats: ["+680 ### ####"],
  countryCode: ["PW"]
}, {
  formats: ["+595(###)### ###"],
  countryCode: ["PY"]
}, {
  formats: ["+974 #### ####"],
  countryCode: ["QA"]
}, {
  formats: ["+262 ##### ####"],
  countryCode: ["RE"]
}, {
  formats: ["+40 ## ### ####"],
  countryCode: ["RO"]
}, {
  formats: ["+381 ## ### ####"],
  countryCode: ["RS"]
}, {
  formats: ["+7(###)### ## ##"],
  countryCode: ["RU"]
}, {
  formats: ["+250(###)### ###"],
  countryCode: ["RW"]
}, {
  formats: ["+966 5 #### ####", "+966 # ### ####"],
  countryCode: ["SA"]
}, {
  formats: ["+677 ### ####", "+677 #####"],
  countryCode: ["SB"]
}, {
  formats: ["+248 # ### ###"],
  countryCode: ["SC"]
}, {
  formats: ["+249 ## ### ####"],
  countryCode: ["SD"]
}, {
  formats: ["+46 ## ### ####"],
  countryCode: ["SE"]
}, {
  formats: ["+65 #### ####"],
  countryCode: ["SG"]
}, {
  formats: ["+290 ####", "+290 ####"],
  countryCode: ["SH"]
}, {
  formats: ["+386 ## ### ###"],
  countryCode: ["SI"]
}, {
  formats: ["+421(###)### ###"],
  countryCode: ["SK"]
}, {
  formats: ["+232 ## ######"],
  countryCode: ["SL"]
}, {
  formats: ["+378 #### ######"],
  countryCode: ["SM"]
}, {
  formats: ["+221 ## ### ####"],
  countryCode: ["SN"]
}, {
  formats: ["+252 ## ### ###", "+252 # ### ###", "+252 # ### ###"],
  countryCode: ["SO"]
}, {
  formats: ["+597 ### ####", "+597 ### ###"],
  countryCode: ["SR"]
}, {
  formats: ["+211 ## ### ####"],
  countryCode: ["SS"]
}, {
  formats: ["+239 ## #####"],
  countryCode: ["ST"]
}, {
  formats: ["+503 ## ## ####"],
  countryCode: ["SV"]
}, {
  formats: ["+1(721)### ####"],
  countryCode: ["SX"]
}, {
  formats: ["+963 ## #### ###"],
  countryCode: ["SY"]
}, {
  formats: ["+268 ## ## ####"],
  countryCode: ["SZ"]
}, {
  formats: ["+1(649)### ####"],
  countryCode: ["TC"]
}, {
  formats: ["+235 ## ## ## ##"],
  countryCode: ["TD"]
}, {
  formats: ["+228 ## ### ###"],
  countryCode: ["TG"]
}, {
  formats: ["+66 ## ### ####", "+66 ## ### ###"],
  countryCode: ["TH"]
}, {
  formats: ["+992 ## ### ####"],
  countryCode: ["TJ"]
}, {
  formats: ["+690 ####"],
  countryCode: ["TK"]
}, {
  formats: ["+670 ### ####", "+670 77# #####", "+670 78# #####"],
  countryCode: ["TL"]
}, {
  formats: ["+993 # ### ####"],
  countryCode: ["TM"]
}, {
  formats: ["+216 ## ### ###"],
  countryCode: ["TN"]
}, {
  formats: ["+676 #####"],
  countryCode: ["TO"]
}, {
  formats: ["+90(###)### ####"],
  countryCode: ["TR"]
}, {
  formats: ["+1(868)### ####"],
  countryCode: ["TT"]
}, {
  formats: ["+688 90####", "+688 2####"],
  countryCode: ["TV"]
}, {
  formats: ["+886 # #### ####", "+886 #### ####"],
  countryCode: ["TW"]
}, {
  formats: ["+255 ## ### ####"],
  countryCode: ["TZ"]
}, {
  formats: ["+380(##)### ## ##"],
  countryCode: ["UA"]
}, {
  formats: ["+256(###)### ###"],
  countryCode: ["UG"]
}, {
  formats: ["+44 #### ######"],
  countryCode: ["GB", "UK"]
}, {
  formats: ["+598 # ### ## ##"],
  countryCode: ["UY"]
}, {
  formats: ["+998 ## ### ####"],
  countryCode: ["UZ"]
}, {
  formats: ["+39 6 698 #####"],
  countryCode: ["VA"]
}, {
  formats: ["+1(784)### ####"],
  countryCode: ["VC"]
}, {
  formats: ["+58(###)### ####"],
  countryCode: ["VE"]
}, {
  formats: ["+1(284)### ####"],
  countryCode: ["VG"]
}, {
  formats: ["+1(340)### ####"],
  countryCode: ["VI"]
}, {
  formats: ["+84 ## #### ###", "+84(###)#### ###"],
  countryCode: ["VN"]
}, {
  formats: ["+678 ## #####", "+678 #####"],
  countryCode: ["VU"]
}, {
  formats: ["+681 ## ####"],
  countryCode: ["WF"]
}, {
  formats: ["+685 ## ####"],
  countryCode: ["WS"]
}, {
  formats: ["+967 ### ### ###", "+967 # ### ###", "+967 ## ### ###"],
  countryCode: ["YE"]
}, {
  formats: ["+27 ## ### ####"],
  countryCode: ["ZA"]
}, {
  formats: ["+260 ## ### ####"],
  countryCode: ["ZM"]
}, {
  formats: ["+263 # ######"],
  countryCode: ["ZW"]
}, {
  formats: ["+1(###)### ####"],
  countryCode: ["US", "CA"]
}];
/**
 * Generate a random phone number.
 *
 * @category person
 *
 * @example
 *
 * randPhoneNumber()
 *
 * @example
 *
 * randPhoneNumber({ countryCode: 'US' })
 *
 * @example
 *
 * randPhoneNumber({ length: 10 })
 *
 */

function randPhoneNumber(options) {
  let formats;

  if (options != null && options.countryCode) {
    var _data$find;

    formats = ((_data$find = data$F.find(country => {
      return country.countryCode.includes(options.countryCode);
    })) == null ? void 0 : _data$find.formats) || [];
  } else {
    formats = data$F.map(({
      formats
    }) => formats).flat();
  }

  const phoneNumber = Array.from({
    length: (options == null ? void 0 : options.length) || 1
  }, (_, index) => {
    return randMask({
      mask: randElement(formats)
    });
  });
  return fake(phoneNumber, options);
}

var data$E = ["Try to program the GB interface, maybe it will copy the wireless hard drive!", "Try to bypass the GB panel, maybe it will synthesize the back-end transmitter!", "If we program the protocol, we can get to the SDD application through the virtual RAM pixel!", "Use the open-source THX application, then you can quantify the solid state transmitter!", "You cant transmit the firewall without copying the 1080p SDD interface!", "Ill compress the open-source SAS bandwidth, that should array the FTP port!", "programming the alarm wont do anything, we need to hack the solid state ADP transmitter!", "calculating the interface wont do anything, we need to bypass the mobile IB panel!", "Try to calculate the GB transmitter, maybe it will quantify the online pixel!", "If we calculate the circuit, we can get to the HDD driver through the optical XML panel!", "navigating the program wont do anything, we need to calculate the cross-platform SMS capacitor!", "Try to calculate the JBOD firewall, maybe it will override the redundant port!", "If we quantify the alarm, we can get to the FTP pixel through the online SSL interface!", "You cant override the capacitor without indexing the bluetooth PNG pixel!", "quantifying the microchip wont do anything, we need to index the online SQL hard drive!", "connecting the port wont do anything, we need to program the haptic RSS pixel!", "We need to back up the 1080p JBOD bandwidth!", "If we index the card, we can get to the SMS hard drive through the bluetooth AGP bus!", "Ill compress the optical SDD hard drive, that should interface the XSS bandwidth!", "You cant copy the feed without compressing the primary JBOD circuit!", "If we back up the application, we can get to the TCP bus through the auxiliary FTP hard drive!", "Try to override the RSS port, maybe it will quantify the haptic port!", "We need to calculate the bluetooth JBOD bus!", "bypassing the bus wont do anything, we need to program the wireless SDD driver!", "Try to parse the PCI capacitor, maybe it will quantify the bluetooth interface!", "copying the monitor wont do anything, we need to synthesize the back-end ADP application!", "Try to index the PNG card, maybe it will transmit the neural system!", "Try to bypass the SCSI sensor, maybe it will generate the 1080p card!", "We need to calculate the open-source SDD driver!", "If we reboot the port, we can get to the RSS application through the 1080p SQL microchip!", "Use the cross-platform AI system, then you can connect the digital card!", "We need to navigate the virtual SSL transmitter!", "The JSON hard drive is down, bypass the redundant firewall so we can copy the FTP port!", "We need to navigate the haptic JBOD system!", "We need to generate the virtual USB pixel!", "Ill override the digital ADP alarm, that should microchip the USB firewall!", "We need to bypass the redundant RAM pixel!", "Ill compress the cross-platform EXE card, that should circuit the AGP sensor!", "The AGP protocol is down, compress the open-source card so we can override the XML program!", "Ill reboot the bluetooth GB capacitor, that should card the HDD panel!", "Ill connect the neural IB matrix, that should array the CSS card!", "The EXE matrix is down, transmit the wireless matrix so we can index the RAM pixel!", "The THX monitor is down, reboot the auxiliary array so we can parse the XML microchip!", "Try to override the HDD firewall, maybe it will generate the open-source panel!", "We need to index the digital JBOD bus!", "Use the multi-byte THX firewall, then you can back up the digital system!", "Use the 1080p IB feed, then you can reboot the haptic feed!", "Try to bypass the SAS card, maybe it will transmit the solid state system!", "Try to quantify the TCP array, maybe it will index the virtual transmitter!", "Ill override the cross-platform PCI port, that should driver the FTP card!", "If we override the bandwidth, we can get to the SMTP capacitor through the cross-platform RSS alarm!", "Use the redundant AGP transmitter, then you can generate the 1080p circuit!", "Use the auxiliary EXE monitor, then you can hack the haptic port!", "Try to synthesize the SCSI card, maybe it will back up the 1080p circuit!", "We need to transmit the auxiliary GB sensor!", "Use the mobile GB transmitter, then you can quantify the wireless system!", "Try to quantify the SQL application, maybe it will bypass the primary pixel!", "You cant override the protocol without programming the mobile RAM card!", "The JBOD port is down, program the wireless array so we can input the PCI program!", "Use the auxiliary JSON card, then you can copy the optical matrix!", "We need to calculate the wireless TCP circuit!", "Use the back-end AI firewall, then you can parse the optical program!", "navigating the hard drive wont do anything, we need to synthesize the auxiliary USB circuit!", "Ill quantify the redundant TCP bus, that should hard drive the ADP bandwidth!", "If we back up the sensor, we can get to the JBOD matrix through the optical EXE alarm!", "Try to generate the TCP bus, maybe it will override the neural bandwidth!", "The ADP protocol is down, parse the 1080p card so we can reboot the ADP application!", "calculating the driver wont do anything, we need to generate the optical SMTP feed!", "Ill calculate the 1080p XML transmitter, that should alarm the RSS firewall!", "You cant connect the interface without programming the virtual PNG protocol!", "Use the cross-platform THX array, then you can parse the primary capacitor!", "generating the sensor wont do anything, we need to hack the solid state AI bus!", "Try to calculate the JBOD program, maybe it will synthesize the mobile system!", "We need to program the back-end PNG pixel!", "Ill program the virtual XML microchip, that should transmitter the SDD protocol!", "If we hack the firewall, we can get to the USB application through the bluetooth SDD system!", "Use the auxiliary SDD system, then you can input the redundant hard drive!", "The GB port is down, quantify the mobile circuit so we can hack the SMTP system!", "You cant quantify the driver without transmitting the multi-byte SQL microchip!", "Try to parse the SMTP array, maybe it will generate the multi-byte port!", "copying the system wont do anything, we need to calculate the virtual SSL circuit!", "Use the bluetooth TCP capacitor, then you can reboot the open-source hard drive!", "If we navigate the card, we can get to the ADP array through the open-source IB feed!", "Try to input the HTTP feed, maybe it will reboot the mobile capacitor!", "If we input the driver, we can get to the RAM monitor through the 1080p GB bus!", "Ill calculate the wireless ADP port, that should bandwidth the SSL microchip!", "Use the haptic XSS driver, then you can connect the wireless program!", "quantifying the circuit wont do anything, we need to parse the back-end FTP interface!", "Ill reboot the online COM interface, that should system the THX protocol!", "Try to transmit the HTTP card, maybe it will override the multi-byte hard drive!", "Ill program the back-end THX matrix, that should interface the HDD panel!", "Ill generate the virtual SQL protocol, that should bus the AI hard drive!", "We need to calculate the mobile AGP panel!", "Ill compress the back-end PCI circuit, that should monitor the PNG driver!", "We need to quantify the primary TCP matrix!", "Ill synthesize the primary AI capacitor, that should array the JBOD sensor!", "You cant hack the card without indexing the primary XSS capacitor!", "The TCP feed is down, compress the cross-platform alarm so we can synthesize the XSS array!", "The JSON interface is down, hack the haptic transmitter so we can bypass the XML system!", "Use the online SDD protocol, then you can parse the open-source bandwidth!"];
/**
 * Generate a random phrase.
 *
 * @category text
 *
 * @example
 *
 * randPhrase()
 *
 * @example
 *
 * randPhrase({ length: 10 })
 *
 */

function randPhrase(options) {
  return fake(data$E, options);
}
/**
 * Generate a random port.
 *
 * @category internet
 *
 * @example
 *
 * randPort()
 *
 * @example
 *
 * randPort({ length: 10 })
 *
 */


function randPort(options) {
  return fake(() => randNumber({
    min: 0,
    max: 65535
  }), options);
}
/**
 * Generate a random uuid.
 *
 * @category general, database
 *
 * @example
 *
 * randUuid()
 *
 * @example
 *
 * randUuid({ length: 10 })
 *
 */


function randUuid(options) {
  const v4options = {
    random: randNumber({
      min: 0,
      max: 255,
      length: 16
    })
  };
  return fake(() => (0, _uuid.v4)(v4options), options);
}
/**
 * Generate a random user name.
 *
 * @category person
 *
 * @example
 *
 * randUserName()
 *
 * @example
 *
 * randUserName({ length: 10 })
 *
 * @example
 *
 * randUserName({ firstName: 'Ryan' })
 *
 * @example
 *
 * randUserName({ lastName: 'Smee' })
 *
 */


function randUserName(options) {
  return fake(() => {
    var _options$firstName, _options$lastName;

    const firstName = (_options$firstName = options == null ? void 0 : options.firstName) != null ? _options$firstName : randFirstName();
    const lastName = (_options$lastName = options == null ? void 0 : options.lastName) != null ? _options$lastName : randLastName();
    let userName = `${firstName} ${lastName}`.replace(' ', fake(['.', '_']));

    if (randBoolean()) {
      userName += randNumber({
        min: 0,
        max: 100
      });
    }

    return userName;
  }, options);
}

var data$D = ["King Drives", "Georgiana Throughway", "Antonietta Highway", "Elian Road", "Reynold Crossing", "Max Wall", "Lehner Drive", "Graham Walks", "Buckridge Drives", "Schimmel Fields", "Doyle Expressway", "Cade Forks", "Myriam Spur", "Fannie Loaf", "Dorian Gateway", "Ruecker Fields", "Daugherty Center", "Emerald Key", "Jazmyn Isle", "Viviane Junctions", "Price Spring", "Aracely Row", "Chyna Plaza", "Harmon Lodge", "Konopelski Inlet", "Dave Stravenue", "Goyette Circle", "Stokes Wells", "Arturo Manors", "Schumm Land", "Bechtelar Fields", "Natalia Points", "Dianna Inlet", "Curt Locks", "Durgan Parkways", "Dante Summit", "Hilma Mills", "Stiedemann Field", "Genesis Plaza", "Carmelo Plaza", "Gutkowski Ferry", "Abbott Square", "Hodkiewicz Oval", "Heathcote Cliff", "Calista Via", "Kihn Expressway", "Caesar Place", "Lockman Greens", "Brisa Hill", "Quigley Parkways", "Howell Vista", "Fisher Light", "Tremblay Springs", "Stroman Turnpike", "Howell Plaza", "Wilma Greens", "Adell Mews", "Shakira Crossroad", "Moises Causeway", "Frances Groves", "Sammy Creek", "Wolf Glen", "Fay Corners", "Collins Lane", "Smitham Drive", "Cronin Shoal", "Missouri Extension", "Leffler Fields", "Laurianne Glens", "Parker Ways", "Benny River", "Kreiger Mission", "Dameon Mountain", "Emard Hill", "Quitzon Green", "Corwin Mission", "Rosendo Spring", "Carter Pike", "Harber Village", "Jade Shore", "Dariana Junction", "Beer Plaza", "Hauck Stream", "Joshuah Fork", "Rath Walk", "Eugenia Heights", "Kuphal Mountain", "Zboncak Harbor", "Torphy Fords", "Jocelyn Throughway", "Cole Center", "Forest Path", "Oswald Junction", "King Springs", "Zulauf Branch", "Esteban Inlet", "Conner Vista", "Zboncak Center", "Glover Lights", "Rohan Tunnel"];
/**
 * Generate a random street name.
 *
 * @category address
 *
 * @example
 *
 * randStreetName()
 *
 * @example
 *
 * randStreetName({ length: 10 })
 *
 */

function randStreetName(options) {
  return fake(data$D, options);
}
/**
 * Generate a random street address.
 *
 * @category address
 *
 * @example
 *
 * randStreetAddress()
 *
 * @example
 *
 * randStreetAddress({ length: 10 })
 *
 */


function randStreetAddress(options) {
  return fake(() => `${randNumber({
    min: 0,
    max: 1500
  })} ${randStreetName()}`, options);
}
/**
 * Generate a random zip code.
 *
 * @category address
 *
 * @example
 *
 * randZipCode()
 *
 * @example
 *
 * randZipCode({ length: 10 })
 *
 */


function randZipCode(options) {
  return fake(() => {
    let zipCode = '' + randNumber({
      min: 10000,
      max: 99999
    });

    if (randBoolean()) {
      zipCode += '-' + randNumber({
        min: 1000,
        max: 9999
      });
    }

    return zipCode;
  }, options);
}
/**
 * Generate a random address.
 *
 * @category entities, address
 *
 * @example
 *
 * randAddress()
 *
 * @example
 *
 * randAddress({ includeCounty: false }) // default is true
 *
 * @example
 *
 * randAddress({ includeCountry: false }) // default is true
 *
 * @example
 *
 * randAddress({ length: 10 })
 *
 */


function randAddress(options) {
  var _options$includeCount, _options$includeCount2;

  const includeCounty = (_options$includeCount = options == null ? void 0 : options.includeCounty) != null ? _options$includeCount : true;
  const includeCountry = (_options$includeCount2 = options == null ? void 0 : options.includeCountry) != null ? _options$includeCount2 : true;

  const factory = () => {
    const address = {
      street: randStreetAddress(),
      city: randCity(),
      zipCode: randZipCode()
    };

    if (includeCounty) {
      address.county = randCounty();
    }

    if (includeCountry) {
      address.country = randCountry();
    }

    return address;
  };

  return fake(factory, options);
}
/**
 * Generate a random user.
 *
 * @category entities, user
 *
 * @example
 *
 * randUser()
 *
 * @example
 *
 * randUser({ length: 10 })
 *
 */


function randUser(options) {
  return fake(() => {
    const firstName = randFirstName({
      withAccents: false
    });
    const lastName = randLastName({
      withAccents: false
    });
    const user = {
      id: randUuid(),
      email: randEmail({
        firstName,
        lastName
      }),
      firstName,
      lastName,
      phone: randPhoneNumber(),
      img: randAvatar(),
      username: randUserName({
        firstName,
        lastName
      }),
      address: randAddress()
    };
    return user;
  }, options);
}
/**
 * Generate a random text.
 *
 * @category text
 *
 * @example
 *
 * randText()
 *
 * @example
 *
 * randText({ length: 10 })
 *
 * @example
 *
 * randText({ charCount: 10 }) // default is 10
 *
 */


function randText(options) {
  var _options$charCount;

  const charCount = (_options$charCount = options == null ? void 0 : options.charCount) != null ? _options$charCount : 10;

  if (charCount < 1 || isNaN(charCount)) {
    throw 'Character count must be greater than 0';
  }

  const factory = () => {
    let text = randSentence();

    if (charCount === 1) {
      return randAlpha();
    }

    while (text.length < charCount) {
      text += ` ${randSentence()}`;
    }

    text = text.substring(0, charCount - 2); // Ensure last char is always a full-stop (not a space)

    text += `${randAlpha()}.`;
    return text;
  };

  return fake(factory, options);
}
/**
 * Generate a random post.
 *
 * @category entities, internet
 *
 * @example
 *
 * randPost()
 *
 * @example
 *
 * randPost({ length: 10 })
 *
 */


function randPost(options) {
  return fake(() => {
    const post = {
      id: randUuid(),
      title: randText({
        charCount: 40
      }),
      body: randText({
        charCount: 500
      }),
      comments: Array.from({
        length: randNumber({
          min: 1,
          max: 5
        })
      }, () => {
        return {
          id: randUuid(),
          text: randText({
            charCount: 100
          }),
          user: randUser()
        };
      })
    };
    return post;
  }, options);
}

var data$C = ["low", "medium", "high", "critical", "urgent", "major", "moderate", "minor"];
/**
 * Generate a random priority.
 *
 * @category general
 *
 * @example
 *
 * randPriority()
 *
 * @example
 *
 * randPriority({ length: 10 })
 *
 */

function randPriority(options) {
  return fake(data$C, options);
}

var data$B = ["Small Rubber Shoes", "Fantastic Wooden Sausages", "Handmade Frozen Salad", "Intelligent Soft Car", "Intelligent Concrete Chips", "Handcrafted Concrete Bacon", "Small Fresh Fish", "Rustic Metal Towels", "Unbranded Cotton Hat", "Fantastic Frozen Bike", "Generic Rubber Shirt", "Unbranded Wooden Keyboard", "Awesome Metal Computer", "Gorgeous Fresh Shoes", "Unbranded Concrete Sausages", "Practical Wooden Ball", "Ergonomic Soft Towels", "Small Plastic Table", "Awesome Metal Pants", "Licensed Steel Sausages", "Handcrafted Rubber Bike", "Ergonomic Cotton Computer", "Generic Wooden Ball", "Fantastic Frozen Soap", "Generic Plastic Keyboard", "Awesome Cotton Pizza", "Licensed Metal Chips", "Handcrafted Cotton Towels", "Handmade Plastic Tuna", "Practical Granite Keyboard", "Intelligent Concrete Soap", "Rustic Concrete Chips", "Fantastic Steel Hat", "Rustic Cotton Chair", "Gorgeous Metal Pants", "Intelligent Metal Bacon", "Handmade Rubber Car", "Tasty Concrete Keyboard", "Incredible Granite Hat", "Practical Rubber Fish", "Rustic Cotton Gloves", "Rustic Cotton Ball", "Refined Fresh Shirt", "Generic Granite Sausages", "Rustic Granite Fish", "Practical Wooden Bacon", "Sleek Plastic Chair", "Handcrafted Fresh Mouse", "Small Concrete Shoes", "Awesome Fresh Chair", "Incredible Soft Computer", "Tasty Concrete Chips", "Generic Rubber Sausages", "Intelligent Concrete Chicken", "Rustic Soft Ball", "Awesome Steel Towels", "Incredible Fresh Bike", "Unbranded Granite Chicken", "Rustic Concrete Bike", "Small Frozen Sausages", "Intelligent Plastic Gloves", "Ergonomic Frozen Towels", "Refined Frozen Ball", "Refined Cotton Ball", "Licensed Steel Salad", "Intelligent Wooden Bacon", "Unbranded Metal Shoes", "Fantastic Granite Car", "Ergonomic Granite Bacon", "Awesome Wooden Shirt", "Rustic Wooden Pizza", "Tasty Frozen Table", "Awesome Wooden Hat", "Awesome Rubber Salad", "Licensed Concrete Fish", "Fantastic Soft Cheese", "Rustic Frozen Pizza", "Refined Concrete Tuna", "Small Frozen Tuna", "Licensed Granite Cheese", "Practical Rubber Car", "Rustic Steel Sausages", "Awesome Concrete Hat", "Awesome Granite Sausages", "Sleek Plastic Chips", "Handcrafted Wooden Gloves", "Intelligent Metal Computer", "Fantastic Fresh Sausages", "Fantastic Plastic Salad", "Unbranded Steel Sausages", "Handcrafted Wooden Fish", "Sleek Wooden Bacon", "Unbranded Plastic Towels", "Tasty Soft Sausages", "Generic Metal Shirt", "Handmade Granite Cheese", "Small Fresh Bacon", "Tasty Granite Towels", "Licensed Steel Chips"];
/**
 * Generate a random product name.
 *
 * @category commerce
 *
 * @example
 *
 * randProductName()
 *
 * @example
 *
 * randProductName({ length: 10 })
 *
 */

function randProductName(options) {
  return fake(data$B, options);
}

var data$A = ["Bostons most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles", "The Football Is Good For Training And Recreational Purposes", "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016", "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive", "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality", "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals", "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design", "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit", "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart", "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"];
/**
 * Generate a random product description.
 *
 * @category Commerce
 *
 * @example
 *
 * randProductDescription()
 *
 * @example
 *
 * randProductDescription({ length: 10 })
 *
 */

function randProductDescription(options) {
  return fake(data$A, options);
}

var data$z = ["Antiques", "Appliances", "Automotive Parts & Accessories", "Automotive Parts", "Baby & Personal Care", "Books", "CDs & Vinyl", "Clothing", "Collectibles", "Computers & Tablets", "Crafts", "Electronics", "Garden", "Grocery", "Health & Beauty", "Kindle", "Movies & TV", "Musical Instruments", "Smartphones & Accessories", "Sporting Goods", "Toys", "Video Games"];
/**
 * Generate a random product category.
 *
 * @category Commerce
 *
 * @example
 *
 * randProductCategory()
 *
 * @example
 *
 * randProductCategory({ length: 10 })
 *
 */

function randProductCategory(options) {
  return fake(data$z, options);
}
/**
 * Generate a random product.
 *
 * @category entities
 *
 * @example
 *
 * randProduct()
 *
 * @example
 *
 * randProduct({ length: 10 })
 *
 */


function randProduct(options) {
  return fake(() => ({
    id: randUuid(),
    title: randProductName(),
    description: randProductDescription(),
    price: getRandomInRange({
      fraction: 2
    }).toString(),
    category: randProductCategory(),
    image: randImg(),
    rating: {
      rate: getRandomInRange({
        min: 0.1,
        max: 5.0,
        fraction: 1
      }).toString(),
      count: getRandomInRange({
        min: 0,
        max: 10000
      }).toString()
    }
  }), options);
}

var data$y = ["Awesome", "Rustic", "Small", "Gorgeous", "Fantastic", "Sleek", "Intelligent", "Unbranded", "Refined", "Licensed", "Generic", "Practical", "Ergonomic", "Handcrafted", "Tasty", "Handmade", "Incredible"];
/**
 * Generate a random product adjective.
 *
 * @category commerce
 *
 * @example
 *
 * randProductAdjective()
 *
 * @example
 *
 * randProductAdjective({ length: 10 })
 *
 */

function randProductAdjective(options) {
  return fake(data$y, options);
}

var data$x = ["Metal", "Plastic", "Rubber", "Frozen", "Soft", "Concrete", "Granite", "Fresh", "Steel", "Cotton", "Wooden"];
/**
 * Generate a random product material.
 *
 * @category commerce
 *
 * @example
 *
 * randProductMaterial()
 *
 * @example
 *
 * randProductMaterial({ length: 10 })
 *
 */

function randProductMaterial(options) {
  return fake(data$x, options);
}

var data$w = ["Python", "Java", "JavaScript", "C", "C++", "C#", "PHP", "Kotlin", "R", "TypeScript", "Abap", "Swift", "Objective-C", "VBA", "Matlab", "Go", "Scala", "Ruby", "Groovy", "Dart", "Cobol", "Visual Basic", "Perl", "Julia", "Rust", "Lua", "Lisp", "Haskell", "Delphi"];
/**
 * Generate a random programming language.
 *
 * @category code
 *
 * @example
 *
 * randProgrammingLanguage()
 *
 * @example
 *
 * randProgrammingLanguage({ length: 10 })
 *
 */

function randProgrammingLanguage(options) {
  return fake(data$w, options);
}

var data$v = ["They/Them", "She/Her", "He/Him", "Ze/Hir"];
/**
 * Generate a random pronoun.
 *
 * @category person
 *
 * @example
 *
 * randPronoun()
 *
 */

function randPronoun(options) {
  return fake(data$v, options);
}

var data$u = ["https", "http", "tcp", "udp", "ip", "pop", "smtp", "dhcp", "l2tp", "ftp", "imap"];
var data$t = ["Hyper Text Transfer Protocol Secure", "Hyper Text Transfer Protocol", "Transmission Control Protocol", "User Datagram Protocol", "Internet Protocol", "Post office Protocol", "Simple mail transport Protocol", "Dynamic Host Configuration Protoco", "Layer Two Tunnelling Protocol", "File Transfer Protocol", "Internet Message Access Protocol"];
/**
 * Generate a random protocol.
 *
 * @category internet
 *
 * @example
 *
 * randProtocol()
 *
 * @example
 *
 * randProtocol({ length: 10 })
 *
 * @example
 *
 * randProtocol({ fullName: true })
 *
 */

function randProtocol(options) {
  return fake(options != null && options.fullName ? data$t : data$u, options);
}

var data$s = ["A stumble may prevent a fall.", "Put your future in good hands your own.", "What you see depends on what you're looking for.", "Worry gives a small thing a big shadow.", "To get something you never had, you have to do something you never did.", "Be thankful when you don't know something for it gives you the opportunity to learn.", "Letting go is not the end of the world; it is the beginning of a new life.", "Our greatest glory is not in never failing but rising everytime we fall.", "Being right is highly overrated. Even a stopped clock is right twice a day.", "Love is not blind; it simply enables one to see things others fail to see.", "If you get up one more time than you fall, you will make it through.", "Don't focus on making the right decision, focus on making the decision the right one.", "Love is just a word until someone comes along and gives it meaning.", "We all have problems. The way we solve them is what makes us different.", "Invent your world. Surround yourself with people, color, sounds, and work that nourish you.", "Every day may not be good, but there's something good in every day.", "Some people think it's holding that makes one strong sometimes it's letting go.", "Why worry about things you cannot control when you can keep yourself busy controlling the things that depend on you?", "It is better to take many small steps in the right direction than to make a great leap forward only to stumble backward.", "As the rest of the world is walking out the door, your best friends are the ones walking in.", "Why compare yourself with others? No one in the entire world can do a better job of being you than you.", "A good teacher is like a candle it consumes itself to light the way for others.", "Life is not measured by the breaths we take, but by the moments that take our breath.", "The real measure of your wealth is how much youd be worth if you lost all your money.", "Though no one can go back and make a brand new start, anyone can start from now and make a brand new ending.", "A friend is someone who understands your past, believes in your future, and accepts you just the way you are.", "Giving up doesn't always mean you are weak. Sometimes it means that you are strong enough to let go.", "Never miss an opportunity to make others happy, even if you have to leave them alone in order to do it.", "Yesterday is history. Tomorrow is a mystery. And today? Today is a gift that's why they call it the present.", "When you don't know what you believe, everything becomes an argument. Everything is debatable. But when you stand for something, decisions are obvious.", "Every sixty seconds you spend angry, upset or mad, is a full minute of happiness you will never get back.", "If we are facing in the right direction, all we have to do is keep on walking.", "Peace of mind is not the absence of conflict from life, but the ability to cope with it.", "An obstacle may be either a stepping stone or a stumbling block.", "I've never seen a smiling face that was not beautiful.", "Kindness is the greatest wisdom.", "Don't miss all the beautiful colors of the rainbow looking for that pot of gold.", "You don't drown by falling in water. You drown by staying there.", "Never be afraid to try, remember... Amateurs built the ark, Professionals built the Titanic.", "A smile is a light in the window of your face to show your heart is at home.", "You may only be someone in the world, but to someone else, you may be the world.", "A bend in the road is not the end of the road...unless you fail to make the turn.", "One who asks a question is a fool for five minutes; one who does not ask a question remains a fool forever.", "Courage is the discovery that you may not win, and trying when you know you can lose.", "A good rest is half the work.", "All the flowers of all the tomorrows are in the seeds of today.", "A man is not where he lives but where he loves.", "The world does not happen to you it happens from you.", "More powerful than the will to win is the courage to begin.", "What we see is mainly what we look for.", "Don't wait for people to be friendly. Show them how.", "Don't let today's disappointments cast a shadow on tomorrow's dreams.", "Never let lack of money interfere with having fun.", "He who has health has hope, and he who has hope has everything.", "The difficulties of life are intended to make us better, not bitter.", "Change your words. Change your world.", "Open minds lead to open doors.", "Each time we face a fear, we gain strength, courage, and confidence in the doing.", "If you come to a fork in the road, take it.", "Nobody can do everything, but everybody can do something.", "Why worry about tomorrow, when today is all we have?", "Most smiles are started by another smile.", "When you lose, don't lose the lesson.", "If I could reach up and hold a star for every time you've made me smile, the entire evening sky would be in the palm of my hand.", "The steeper the mountain the harder the climb the better the view from the finishing line", "Don't let what you can't do stop you from doing what you can do.", "You can never cross the ocean unless you have the courage to lose sight of the shore.", "The best place to find a helping hand is at the end of your own arm.", "Don't fear failure so much that you refuse to try new things. The saddest summary of life contains three descriptions: could have, might have, and should have.", "We cannot direct the wind but we can adjust the sails.", "Giving up doesn't always mean you are weak; sometimes it means that you are strong enough to let go.", "Many people have gone further than they thought they could because someone else thought they could.", "Never tell me the sky is the limit when there are footprints on the moon.", "Count your joys instead of your woes. Count your friends instead of your foes.", "Beware of the half truth. You may have gotten hold of the wrong half.", "It's not who you are that holds you back, it's who you think you're not.", "Choosing to be positive and having a grateful attitude is going to determine how you're going to live your life.", "My attitude is that if you push me towards something that you think is a weakness, then I will turn that perceived weakness into a strength.", "Weakness of attitude becomes weakness of character.", "Nothing can stop the man with the right mental attitude from achieving his goal nothing on earth can help the man with the wrong mental attitude.", "Attitude is a little thing that makes a big difference.", "Your attitude, not your aptitude, will determine your altitude.", "There is little difference in people, but that little difference makes a big difference. The little difference is attitude. The big difference is whether it is positive or negative.", "Develop an attitude of gratitude, and give thanks for everything that happens to you, knowing that every step forward is a step toward achieving something bigger and better than your current situation.", "Everything can be taken from a man but one thing: the last of human freedoms - to choose one's attitude in any given set of circumstances, to choose one's own way.", "A positive attitude causes a chain reaction of positive thoughts, events and outcomes. It is a catalyst and it sparks extraordinary results.", "Morality is simply the attitude we adopt towards people whom we personally dislike.", "It is not the body's posture, but the heart's attitude that counts when we pray.", "People may hear your words, but they feel your attitude.", "But the attitude of faith is to let go, and become open to truth, whatever it might turn out to be.", "Character is the result of two things: mental attitude and the way we spend our time.", "Our attitude towards others determines their attitude towards us.", "Adopting the right attitude can convert a negative stress into a positive one.", "Take the attitude of a student, never be too big to ask questions, never know too much to learn something new.", "The reactionary is always willing to take a progressive attitude on any issue that is dead.", "Ability is what you're capable of doing. Motivation determines what you do. Attitude determines how well you do it.", "Cock your hat - angles are attitudes.", "When you pray for anyone you tend to modify your personal attitude toward him.", "If you are going to achieve excellence in big things, you develop the habit in little matters. Excellence is not an exception, it is a prevailing attitude.", "I'm only going to stand before God and give an account for my life, not for somebody else's life. If I have a bad attitude, then I need to say there's no point in me blaming you for what's wrong in my life.", "It is our attitude at the beginning of a difficult task which, more than anything else, will affect its successful outcome.", "My attitude is, if someone's going to criticize me, tell me to my face.", "Having a positive mental attitude is asking how something can be done rather than saying it can't be done.", "My general attitude to life is to enjoy every minute of every day. I never do anything with a feeling of, 'Oh God, I've got to do this today.'", "A complainer is like a Death Eater because there's a suction of negative energy. You can catch a great attitude from great people.", "The meaning of things lies not in the things themselves, but in our attitude towards them.", "Pink isn't just a color, it's an attitude!", "The remarkable thing is, we have a choice everyday regarding the attitude we will embrace for that day.", "A positive attitude can really make dreams come true - it did for me.", "Good humor is one of the best articles of dress one can wear in society.", "When you are thwarted, it is your own attitude that is out of order.", "I think it's my adventure, my trip, my journey, and I guess my attitude is, let the chips fall where they may.", "Bad attitudes will ruin your team.", "For success, attitude is equally as important as ability.", "Happiness is an attitude of mind, born of the simple determination to be happy under all outward circumstances.", "Great effort springs naturally from great attitude.", "Attitudes are more important than facts.", "Attitude is everything.", "Attitude determines the altitude of life.", "Our attitude toward life determines life's attitude towards us.", "The greatest discovery of my generation is that man can alter his life simply by altering his attitude of mind.", "But my attitude about it is I have miles to go before I sleep.", "The attitude is very important. Because, your behavior radiates how you feel.", "When you ain't got no money, you gotta get an attitude.", "Civilization is a method of living, an attitude of equal respect for all men.", "Most of us start out with a positive attitude and a plan to do our best.", "There are no menial jobs, only menial attitudes.", "Funny is an attitude.", "The biggest challenge is how to affect public attitudes and make people care.", "If you don't like something, change it. If you can't change it, change your attitude.", "It is very important to generate a good attitude, a good heart, as much as possible. From this, happiness in both the short term and the long term for both yourself and others will come.", "Your living is determined not so much by what life brings to you as by the attitude you bring to life not so much by what happens to you as by the way your mind looks at what happens.", "Happiness doesn't depend on any external conditions, it is governed by our mental attitude.", "Whenever you're in conflict with someone, there is one factor that can make the difference between damaging your relationship and deepening it. That factor is attitude.", "Keep a good attitude and do the right thing even when it's hard. When you do that you are passing the test. And God promises you your marked moments are on their way.", "Success or failure depends more upon attitude than upon capacity successful men act as though they have accomplished or are enjoying something. Soon it becomes a reality. Act, look, feel successful, conduct yourself accordingly, and you will be amazed at the positive results.", "Like success, failure is many things to many people. With Positive Mental Attitude, failure is a learning experience, a rung on the ladder, a plateau at which to get your thoughts in order and prepare to try again.", "The only disability in life is a bad attitude.", "If you have a positive attitude and constantly strive to give your best effort, eventually you will overcome your immediate problems and find you are ready for greater challenges.", "You cannot control what happens to you, but you can control your attitude toward what happens to you, and in that, you will be mastering change rather than allowing it to master you.", "The greatest discovery of all time is that a person can change his future by merely changing his attitude.", "A healthy attitude is contagious but don't wait to catch it from others. Be a carrier.", "Any fact facing us is not as important as our attitude toward it, for that determines our success or failure. The way you think about a fact may defeat you before you ever do anything about it. You are overcome by the fact because you think you are.", "Excellence is not a skill. It is an attitude.", "I hope the millions of people I've touched have the optimism and desire to share their goals and hard work and persevere with a positive attitude.", "We cannot change our past. We can not change the fact that people act in a certain way. We can not change the inevitable. The only thing we can do is play on the one string we have, and that is our attitude.", "I was looking for something a lot heavier, yet melodic at the same time. Something different from heavy metal, a different attitude.", "Spend some time this weekend on home improvement improve your attitude toward your family.", "We awaken in others the same attitude of mind we hold toward them.", "There is little difference in people, but that little difference makes a big difference. That little difference is attitude. The big difference is whether it is positive or negative.", "Ability is what you're capable of doing. Motivation determines what you do. Attitude determines how well you do it.", "The last of human freedoms - the ability to chose one's attitude in a given set of circumstances.", "Attitude is more important than the past, than education, than money, than circumstances, than what people do or say. It is more important than appearance, giftedness, or skill.", "Being black is not a matter of pigmentation - being black is a reflection of a mental attitude.", "People in tough times - it doesn't mean they don't have a great attitude.", "A strong positive mental attitude will create more miracles than any wonder drug.", "Certain thoughts are prayers. There are moments when, whatever be the attitude of the body, the soul is on its knees.", "Leadership is practiced not so much in words as in attitude and in actions.", "If a person gets his attitude toward money straight, it will help straighten out almost every other area in his life.", "I've reached a point in my life where it's the little things that matter... I was always a rebel and probably could have got much farther had I changed my attitude. But when you think about it, I got pretty far without changing attitudes. I'm happier with that.", "Fairness is not an attitude. It's a professional skill that must be developed and exercised.", "I think whether you're having setbacks or not, the role of a leader is to always display a winning attitude.", "Be sure what you want and be sure about yourself. Fashion is not just beauty, it's about good attitude. You have to believe in yourself and be strong.", "Hitler and Mussolini were only the primary spokesmen for the attitude of domination and craving for power that are in the heart of almost everyone. Until the source is cleared, there will always be confusion and hate, wars and class antagonisms.", "There must be something solemn, serious, and tender about any attitude which we denominate religious. If glad, it must not grin or snicker if sad, it must not scream or curse.", "Sales are contingent upon the attitude of the salesman - not the attitude of the prospect.", "A positive attitude is not going to save you. What it's going to do is, everyday, between now and the day you die, whether that's a short time from now or a long time from now, that every day, you're going to actually live.", "Always keep that happy attitude. Pretend that you are holding a beautiful fragrant bouquet.", "Black Consciousness is an attitude of the mind and a way of life, the most positive call to emanate from the black world for a long time.", "I think music is the greatest art form that exists, and I think people listen to music for different reasons, and it serves different purposes. Some of it is background music, and some of it is things that might affect a person's day, if not their life, or change an attitude. The best songs are the ones that make you feel something.", "We submit to the majority because we have to. But we are not compelled to call our attitude of subjection a posture of respect.", "The winner's edge is not in a gifted birth, a high IQ, or in talent. The winner's edge is all in the attitude, not aptitude. Attitude is the criterion for success.", "Having a clear faith, based on the creed of the church is often labeled today as fundamentalism. Whereas relativism, which is letting oneself be tossed and swept along by every wind of teaching, look like the only attitude acceptable to today's standards.", "Today's students can put dope in their veins or hope in their brains. If they can conceive it and believe it, they can achieve it. They must know it is not their aptitude but their attitude that will determine their altitude.", "I think a lot of times we don't pay enough attention to people with a positive attitude because we assume they are naive or stupid or unschooled.", "A great attitude does much more than turn on the lights in our worlds it seems to magically connect us to all sorts of serendipitous opportunities that were somehow absent before the change.", "Chaotic people often have chaotic lives, and I think they create that. But if you try and have an inner peace and a positive attitude, I think you attract that.", "I am Classic Rock Revisited. I revisit it every waking moment of my life because it has the spirit and the attitude and the fire and the middle finger. I am Rosa Parks with a Gibson guitar.", "And the attitude of faith is the very opposite of clinging to belief, of holding on.", "Our lives are not determined by what happens to us but how we react to what happens, not by what life brings us but the attitude we bring to life.", "Being a sex symbol has to do with an attitude, not looks. Most men think it's looks, most women know otherwise.", "I am responsible. Although I may not be able to prevent the worst from happening, I am responsible for my attitude toward the inevitable misfortunes that darken life.", "No rational argument will have a rational effect on a man who does not want to adopt a rational attitude.", "When I was a child I asked my mother what homosexuality was about and she said - and this was 100 years ago in Germany and she was very open-minded - 'It's like hair color. It's nothing. Some people are blond and some people have dark hair. It's not a subject.' This was a very healthy attitude.", "Success or failure in business is caused more by the mental attitude even than by mental capacities.", "Obama does not represent America. Nor does he represent anything what our forefathers stood for. This country is basically built on an attitude. It's a way of life. It's not because you're born here. It's not that you're supposed to take from those who have and give to those who haven't. That kills a country. It killed Russia.", "Stop this attitude that older people ain't any good anymore! We're as good as we ever were - if we ever were any good.", "My attitude to peace is rather based on the Burmese definition of peace - it really means removing all the negative factors that destroy peace in this world. So peace does not mean just putting an end to violence or to war, but to all other factors that threaten peace, such as discrimination, such as inequality, poverty.", "Your attitude is like a box of crayons that color your world. Constantly color your picture gray, and your picture will always be bleak. Try adding some bright colors to the picture by including humor, and your picture begins to lighten up.", "Crime is terribly revealing. Try and vary your methods as you will, your tastes, your habits, your attitude of mind, and your soul is revealed by your actions.", "Some people say I have attitude - maybe I do... but I think you have to. You have to believe in yourself when no one else does - that makes you a winner right there.", "The minute you try to talk business with him he takes the attitude that he is a gentleman and a scholar, and the moment you try to approach him on the level of his moral integrity he starts to talk business.", "Stiletto, I look at it more as an attitude as opposed to a high-heeled shoe.", "If somebody says no to you, or if you get cut, Michael Jordan was cut his first year, but he came back and he was the best ever. That is what you have to have. The attitude that I'm going to show everybody, I'm going to work hard to get better and better.", "When you have vision it affects your attitude. Your attitude is optimistic rather than pessimistic.", "What matters to me is that I do what I think is right and I see, I'm a numbers guy, that's my attitude. I know we have a debt tsunami coming, we are bankrupting this country and I'm in a position where I can actually advance ideas to prevent that from happening. That's exactly what I should be doing.", "I developed a nutty attitude where I'd think, If some guy really loves me he doesn't care if I'm fat. I'd come up with all these stupid reasons why it would be OK to be fat.", "Really you just gotta keep chugging along and keep a positive attitude and get through all the problems. You gotta face them, otherwise you don't get through.", "Solidarity is an attitude of resistance, I suppose, or it should be.", "There's always the motivation of wanting to win. Everybody has that. But a champion needs, in his attitude, a motivation above and beyond winning.", "Americans are the most generous country on the planet. I've worked in Europe, I've worked in Australia. There is no where else where you get absolutely no attitude for being a foreigner. If you do your job well, they embrace you.", "When I go to the clinic next and sit with a tube in my arm and watch the poison go in, I'm in an attitude of abject passivity. It doesn't feel like fighting at all it just feels like submitting.", "Our judgments judge us, and nothing reveals us, exposes our weaknesses, more ingeniously than the attitude of pronouncing upon our fellows.", "Pessimism only describes an attitude, and not facts, and hence is entirely subjective.", "I was kicked out of school because of my attitude. I was not assimilating. So I went to work, taking any jobs I could get.", "A lot of times I find that people who are blessed with the most talent don't ever develop that attitude, and the ones who aren't blessed in that way are the most competitive and have the biggest heart.", "So long as you've got your friends about you, and a good positive attitude, you don't really have to care what everyone else thinks.", "I separated from the Southern Baptists when they adopted the discriminatory attitude towards women, because I believe what Paul taught in Galatians that there is no distinction in God's eyes between men and women, slaves and masters, Jews and non-Jews - everybody is created equally in the eyes of God.", "My attitude toward men who mess around is simple: If you find 'em, kill 'em.", "Prayer is talking with God. God knows your heart and is not so concerned with your words as He is with the attitude of your heart.", "You can't study comedy it's within you. It's a personality. My humor is an attitude.", "You call to a dog and a dog will break its neck to get to you. Dogs just want to please. Call to a cat and its attitude is, 'What's in it for me?'", "The compulsion to do good is an innate American trait. Only North Americans seem to believe that they always should, may, and actually can choose somebody with whom to share their blessings. Ultimately this attitude leads to bombing people into the acceptance of gifts.", "I keep guitars that are, you know, the neck's a little bit bent and it's a little bit out of tune. I want to work and battle it and conquer it and make it express whatever attitude I have at that moment. I want it to be a struggle.", "Most of my arguments with musicians through the years have had more to do with their attitude about music, or their attitude about their own lives, or their personal responsibility. Music has never really been the big centerpiece of the fight.", "I love everybody. One of the great things about me is that I have a very positive attitude.", "Mankind's true moral test, its fundamental test (which lies deeply buried from view), consists of its attitude towards those who are at its mercy: animals. And in this respect mankind has suffered a fundamental debacle, a debacle so fundamental that all others stem from it.", "It's sort of a mental attitude about critical thinking and curiosity. It's about mindset of looking at the world in a playful and curious and creative way.", "Punk was defined by an attitude rather than a musical style.", "It's a fundamental, social attitude that the 1% supports symphonies and operas and doesn't support Johnny learning to program hip-hop beats. When I put it like that, it sounds like, 'Well, yeah,' but you start to think, 'Why not, though?' What makes one more valuable than another?", "I think people feel threatened by homosexuality. The problem isn't about gay people, the problem is about the attitude towards gay people. People think that all gays are Hannibal Lecters. But gay people are sons and daughters, politicians and doctors, American heroes and daughters of American heroes.", "I have this theory that, depending on your attitude, your life doesn't have to become this ridiculous charade that it seems so many people end up living.", "It was just like a dream. I could have ended up with an album that's not all that different from anything else coming out of Nashville. Mutt made the difference. He took these songs, my attitude, my creativity, and colored them in a way that is unique.", "I look at Jagger and the like and if I see a good attitude I'll admire it but I wouldn't copy their style.", "My attitude is never to be satisfied, never enough, never.", "Today's youth are told to get rich or die trying and they really shouldn't take that attitude forward with them.", "The purely agitational attitude is not good enough for a detailed consideration of a subject.", "Not every religion has to have St. Augustine's attitude to sex. Why even in our culture marriages are celebrated in a church, everyone present knows what is going to happen that night, but that doesn't prevent it being a religious ceremony.", "Never refuse an assignment except when there is a conflict of interest, a potential of danger to you or your family, or you hold a strongly biased attitude about the subject under focus.", "We can revolutionize the attitude of inner city brown and black kids to learning. We need a civil rights movement within the African-American community.", "It's a question of keeping one's eyes and ears open and watching how other people play the game. They're watching me too, to see what my attitude is like.", "Yes, we're still five little people with a noisy attitude.", "In individual industries where female labour pays an important role, any movement advocating better wages, shorter working hours, etc., would not be doomed from the start because of the attitude of those women workers who are not organized.", "On 'Van Halen,' I was a young punk, and everything revolved around the fastest kid in town, gunslinger attitude. But I'd say that at the time of 'Fair Warning,' I started concentrating more on songwriting. But I guess in most people's minds I'm just a gunslinger.", "Design is about point of view, and there should be some sort of woman or lifestyle or attitude in one's head as a designer.", "Liberalism is an attitude rather than a set of dogmas - an attitude that insists upon questioning all plausible and self-evident propositions, seeking not to reject them but to find out what evidence there is to support them rather than their possible alternatives.", "The Dolls were an attitude. If nothing else they were a great attitude.", "I was impressed by Hendrix. His attitude was brilliant. Even the way he walked was amazing.", "The best way to inspire people to superior performance is to convince them by everything you do and by your everyday attitude that you are wholeheartedly supporting them.", "I think it's your mental attitude. So many of us start dreading age in high school and that's a waste of a lovely life. 'Oh... I'm 30, oh, I'm 40, oh, 50.' Make the most of it.", "The attitude that nature is chaotic and that the artist puts order into it is a very absurd point of view, I think. All that we can hope for is to put some order into ourselves.", "Britishness is just a way of putting things together and a certain don't care attitude about clothes. You don't care, you just do it and it looks great.", "It remains to consider what attitude thoughtful men and Christian believers should take respecting them, and how they stand related to beliefs of another order.", "Surfers have the most attitude.", "I've never run into a guy who could win at the top level in anything today and didn't have the right attitude, didn't give it everything he had, at least while he was doing it wasn't prepared and didn't have the whole program worked out.", "That's what I love from metal, and that's what I love from hip-hop. That's what I love from any music that's hard, that's got an edge to it-The attitude in it.", "That attitude that fighting is probably not fair, but you have to defend yourself anyway and damage the enemy, has been profoundly consequential as far as my political activism goes.", "Seek out that particular mental attribute which makes you feel most deeply and vitally alive, along with which comes the inner voice which says, 'This is the real me,' and when you have found that attitude, follow it.", "People think, 'She's a model. She must have such an attitude. She must be so stuck up.' But I'm normal. I cry. I'm not rich. I drive a 1987 Chevrolet Celebrity.", "My grandfather was a man, when he talked about freedom, his attitude was really interesting. His view was that you had obligations or you had responsibilities, and when you fulfilled those obligations or responsibilities, that then gave you the liberty to do other things.", "I think failure is nothing more than life's way of nudging you that you are off course. My attitude to failure is not attached to outcome, but in not trying. It is liberating. Most people attach failure to something not working out or how people perceive you. This way, it is about answering to yourself.", "Part of our western outlook stems from the scientific attitude and its method of isolating the parts of a phenomenon in order to analyze them.", "There is a single thread of attitude, a single direction of flow, that joins our present time to its early burgeoning in Mediterranean civilization.", "We live in a country that used to have a can-do attitude, and now we have a 'what-can-you-do-for-me?' attitude, and what I try to do is find ways that we can develop common ground.", "Could we change our attitude, we should not only see life differently, but life itself would come to be different.", "The ideal attitude is to be physically loose and mentally tight.", "An attitude to life which seeks fulfillment in the single-minded pursuit of wealth - in short, materialism - does not fit into this world, because it contains within itself no limiting principle, while the environment in which it is placed is strictly limited.", "You may not be able to change a situation, but with humor you can change your attitude about it.", "What was past was past. I suppose that was the general attitude.", "Iraq is just a symbol of the attitude of western democracies to the rest of the world.", "I don't mean this in a stuck-up way, but I needed an attitude song.", "I met my grandfather just before he died, and it was the first time that I had seen Dad with a relative of his. It was interesting to see my own father as a son and the body language and alteration in attitude that comes with that, and it sort of changed our relationship for the better.", "I don't think it's a good attitude in your life to feel that you have to be rich to have self-esteem.", "All we need, really, is a change from a near frigid to a tropical attitude of mind.", "An aristocratic culture does not advertise its emotions. In its forms of expression it is sober and reserved. Its general attitude is stoic.", "I was impressed by Hendrix. Not so much by his playing, as his attitude - he wasn't a great player, but everything else about him was brilliant.", "Attitude is attitude, whether you're a West Coast gangster or East Coast gangster, you know?", "You know, I always say white is not a colour, white is an attitude, and if you haven't got trillions of dollars in the bank that you don't need, you can't be white.", "Being a part of SKECHERS is exciting. It is such a hip company with a great attitude and image.", "It is precisely the purpose of the public opinion generated by the press to make the public incapable of judging, to insinuate into it the attitude of someone irresponsible, uninformed.", "Coaches will eventually notice a great attitude, and they respect that.", "The novelist teaches the reader to comprehend the world as a question. There is wisdom and tolerance in that attitude. In a world built on sacrosanct certainties the novel is dead.", "No one's going to be able to operate without a grounding in the basic sciences. Language would be helpful, although English is becoming increasingly international. And travel. You have to have a global attitude.", "My second husband believed I had such a fickle attitude to friendship that each Friday he would update the list of my 'Top Ten' friends in the manner of a Top Of The Pops chart countdown.", "If you can kill animals, the same attitude can kill human beings. The mentality is the same which exploits nature and which creates wars.", "My attitude is, do as much as I can while I'm free. And if I'm arrested I'll still do as much as I can.", "There are a lot of movies I'd like to throw away. That's not to say that I went in with that attitude. Any film I ever started, I went in with all the hope and best intentions in the world, but some films just don't work.", "By making a comeback, I'm changing the attitude of people toward me. If I'd known that people would react so enthusiastically, I'd have done it years ago.", "Today, I think the attitude is that governing is not necessarily good politics, and the result is that it's much more partisan and much more divided.", "That term's definitely got a negative aura to it, because people think a diva is somebody with an attitude who demands things all the time. Of course there is that type of diva, but my idea of a diva has always been a singer - whether male or female - who gets on that stage and captivates you with their presence and their voice.", "Oh, I don't think Tom Sowell would tell anybody to join the administration. That's not his style. But I think his attitude has always been if it had to be done he'd prefer me to do it than somebody else.", "The Senator from Massachusetts has given us ample grounds to doubt the judgment and the attitude he brings to bear on vital issues of national security.", "I perfectly understood President Obama's attitude throughout the French presidential campaign. He had no reason to distance himself from Nicolas Sarkozy. It's the basic solidarity that leaders who worked together owe to each other.", "I think it has something to do with being British. We don't take ourselves as seriously as some other countries do. I think a lot of people take themselves far too seriously I find that a very tedious attitude.", "I failed the LSAT. Basically, if I had not failed, I'd have been a lawyer and there would be no Spanx. I think failure is nothing more than life's way of nudging you that you are off course. My attitude to failure is not attached to outcome, but in not trying. It is liberating.", "My attitude to writing is like when you do wallpapering, you remember where all the little bits are that don't meet. And then your friends say: It's terrific!", "Liberalism is a really old British tradition and it has a completely different attitude towards the individual and the relationship between the individual and the state than the collectivist response of Labour, and particularly Old Labour, does.", "I've always had a 'Work hard, play hard' attitude to life - I still do - but sometimes you get involved in something that needs a calm, methodical approach.", "I've always considered myself to be fiercely patriotic. I love Britain - its history and the down-to-earth attitude people have.", "There is a brief moment when all there is in a man's mind and soul and spirit is reflected through his eyes, his hands, his attitude. This is the moment to record.", "I was fortunate to play for Pete Rose and have teammates like Ken Griffey Sr., Tony Perez and Dave Concepcion. I grew up in the game with a mature attitude. I've always known it was better to be seen and not heard.", "I've never been out with any of the cast of Coronation Street. We're all very close friends so it's very much a professional attitude.", "Nothing. We're all friends and friendly. So when the cameras go down, depending on the mood or the nature of the material we're dealing with, there's usually a kind of a prevailing light attitude that's floating around.", "I will keep smiling, be positive and never give up! I will give 100 percent each time I play. These are always my goals and my attitude.", "I'm taking a bit of a wait-and-see attitude towards 3D.", "My father instilled in me the attitude of prevailing. If there's a challenge, go for it. If there's a wall to break down, break it down.", "Just as the left has to be more willing to question 'Government knows best,' the right has to rethink its laissez-faire attitude toward government.", "The attitude of insolent haughtiness is characteristic of the relationships Americans form with what is alien to them, with others.", "Although as a sailor I despised politics - for I loved my sailor's life and still love it today - conditions forced me to take up a definite attitude towards political problems.", "How do you nurture a positive attitude when all the statistics say you're a dead man? You go to work.", "The pilot looked at his cues of attitude and speed and orientation and so on and responded as he would from the same cues in an airplane, but there was no way it flew the same. The simulators had showed us that.", "It was my father who instilled the 'never say no' attitude I carry around with me today, and who instilled in me a sense of wonder, always taking us on adventures in the car, never telling us the destination.", "I went to England in the '70s, and I was in my early 20s. There was still a residue of that era of being an underclass or colonial. I assume it must have been a more aggressive and prominent attitude 40 years before that, because Australia internationally wasn't regarded as having much cultural value. We were a country full of sheep and convicts.", "For a writer only one form of patriotism exists: his attitude toward language.", "Gardening is not trivial. If you believe that it is, closely examine why you feel that way. You may discover that this attitude has been forced upon you by mass media and the crass culture it creates and maintains. The fact is, gardening is just the opposite - it is, or should be, a central, basic expression of human life.", "Becoming an author changes your attitude too. Once you see where books come from, and how they're made, they never seem quite as sacred again.", "I was bringing my attitude as a regular person 'cause this is my attitude.", "If you can attribute your success entirely to your own mental effort, to your own attitude, to some spiritual essence that you have that is better than other people's, then that must feel pretty good.", "I fell in love with Erica Kane the summer before my freshman year of high school. Like all red-blooded teen American boys, I'd come home from water polo practice and eat a box of Entenmann's Pop'Ems donut holes in front of the TV while obsessively fawning over 'All My Children' and Erica, her clothes, and her narcissistic attitude.", "Films for TV have to be much closer to the book, mainly because the objective with a TV movie that translates literature is to get the audience, after seeing this version, to pick up the book and read it themselves. My attitude is that TV can never really be any form of art, because it serves audience expectations.", "You can't beat the beehive for glam punkette attitude.", "I haven't seen Clones, which has been during this period when I haven't seen much of anything, but I did see Phantom Menace, and see my feelings about it - see, first of all, I think that when you make a lot of movies, your attitude about the movies changes.", "My attitude is always one of sensuality, aggressive enthusiasm and a kind of outrageousness in my expression.", "Epic poetry exhibits life in some great symbolic attitude. It cannot strictly be said to symbolize life itself, but always some manner of life.", "When you retire, it's a place in life, a part of the journey. You just don't quit work you develop an attitude where you can do what you please.", "When a parent shows up with an attitude of entitlement, understand that under it is a boatload of anxiety.", "What reader wants to be told what attitude to strike?", "My denial and irresponsible attitude about asthma put me at great risk and caused me so much needless suffering. My hope is that the kids I talk to learn to open up about their asthma, become educated about their condition, and seek help.", "Woman must have her freedom, the fundamental freedom of choosing whether or not she will be a mother and how many children she will have. Regardless of what man's attitude may be, that problem is hers - and before it can be his, it is hers alone.", "Even as a little child, I've always had that comedian kind of attitude.", "I mean, the shoe - there is a music to it, there is attitude, there is sound, it's a movement. Clothes - it's a different story. There are a million things I'd rather do before designing clothes: directing, landscaping.", "In just the same way the thousands of successive positions of a runner are contracted into one sole symbolic attitude, which our eye perceives, which art reproduces, and which becomes for everyone the image of a man who runs.", "In the late '70s, maybe just before I started, there was still an attitude that if you did film you didn't do TV and vice versa, but that's gone now.", "I cannot say that the attitude of the United Nations always is for the Israeli attitude. Israel, I think, has been under severe attacks by members of the United Nations many times.", "I love her attitude, but as much as I'd like to bring my medals to a speech or appearance, I never do.", "We must advertise to U.S. business that we are there, that our attitude has changed, and that we care. When we are asked to help, we have to perform and provide the right advice.", "The American attitude towards efficiency and execution should always underlie architecture.", "I have such an extreme attitude about work, where I can just completely be derelict of my responsibilities and then when I am not derelict, I am completely indulged in it. I swing pretty wildly from the two extremes.", "I have a political attitude, but I'm certainly not a politician.", "I think my attitude to human beings has changed since leaving prison.", "I went to the Performing Arts School and studied classical ballet. That attitude is something that's put into your head. You are never thin enough.", "I have always detested any departure from reality, an attitude which I relate to my mother's poor mental health.", "With just about every player in Australia, his whole goal and ambition is to play for Australia. That's why they're playing first class cricket. It's just a different attitude.", "Right after 'Raymond' I had a world-is-my-oyster attitude, but I found out I don't like oysters. I had this existential emptiness. 'What is my purpose? Who am I?' I had a big identity crisis.", "What sculptors do is represent the essence of gesture. What is important in mime is attitude.", "It really was hand-to-mouth and you can say, 'Poor little me, how dreadful, what a deprived childhood', but I didn't feel that way at all. It's all about the attitude at home.", "Having a clear faith, based on the creed of the church is often labeled today as fundamentalism. Whereas relativism, which is letting oneself be tossed and swept along by every wind of teaching, look like the only attitude acceptable to today's standards.", "You know what's funny to me? Attitude.", "The characteristic political attitude of today is not one of positive belief, but of despair.", "If you can't change your fate, change your attitude.", "Mainly what I learned from Buddy... was an attitude. He loved music, and he taught me that it shouldn't have any barriers to it.", "I think fun is an important part of the entertainment industry, and it should be. Anybody who's not incorporating some of that into their work needs to take a break, go away, and have an attitude adjustment.", "I have played on many teams throughout my career, and I know when a team has the tools, and the right positive attitude towards winning.", "Vampires are so old that they don't need to impress anyone anymore. They're comfortable in their own skin. It's this enigmatic strength that's very romantic and old-fashioned. I think it goes back to something of a Victorian attitude of finding a strong man who's going to look after his woman.", "What I wish I had, is that I wish I was a little more Greek, in that I wish I could lose my North American driven attitude and that I could be a little bit more poetic and laissez faire.", "I was always the guy getting kicked out of my classes at school for having an attitude problem.", "And I tell you, having girls has made me a much better man. I have friends who are fathers, but they only have boys, and they have the same attitude toward women they always had, you know? And I don't play that... My girls, you mess with them? I will bury you underground.", "Style is a reflection of your attitude and your personality.", "If a person can be said to have the wrong attitude, there is no need to pay attention to his arguments.", "The attitude is we live and let live. This is actually an amazing change in values in a rather short time and it's an example of freedom from religion.", "Not to discriminate every moment some passionate attitude in those about us, and in the very brilliancy of their gifts some tragic dividing on their ways, is, on this short day of frost and sun, to sleep before evening.", "Players should know that if you can't make the contribution of the winning shot, that your attitude every day when you come to practice, or the positive contribution you make through cheering and keeping up team morale, is just as important in the overall picture.", "It's not the style that motivates me, as much as an attitude of openness that I have when I go into a project.", "The place of chess in the society is closely related to the attitude of young people towards our game.", "We assume that we've come so far as compassionate citizens of the world if we do choose to read the news, yet the attitude towards life can be one where we put blinders on and forget that there are civil wars going on. It's easy to forget that there are so many people starving to death every single day.", "The jokes are great but what really matters for a comedian is his performance, his whole attitude, and the laughs that he gets between the jokes rather than on top of the jokes.", "There were a few teachers who just did not like me because of my face. Once, I was told to stand in the corner until I cheered up. The attitude was, 'Oh, for God's sake, what's the matter with him?' But it's just a natural expression.", "I'm just part of a tradition of people who aren't pleased. I would never think anyone else who has the same attitude was getting it from me. I'd just think they're... sensible.", "The key to life is your attitude. Whether you're single or married or have kids or don't have kids, it's how you look at your life, what you make of it. It's about making the best of your life wherever you are in life.", "If you get a diagnosis, get on a therapy, keep a good attitude and keep your sense of humor.", "When a woman puts on a heel, she has a different posture, a different attitude. She really stands up and has a consciousness of her body.", "Whenever I'm having a bad day and have an attitude, I stay home. I keep it at home.", "You don't have to have an attitude if you're famous.", "I need that aggressive attitude to play my music and more men have that attitude than women.", "But Jesus changes your attitude towards yourself and towards other people.", "But I think bands that rolled in with a big attitude, like they were some big deal, I just found that very strange.", "What irritates me is the bland way people go around saying, 'Oh, our attitude has changed. We don't dislike these people any more.' But by the strangest coincidence, they haven't taken away the injustice the laws are still on the books.", "There is definitely something sexy about a girl with an attitude and a pair of leather pants.", "The phenomenon of home schooling is a wonderful example of the American can-do attitude. Growing numbers of parents have become disenchanted with government-run public schools. Many parents have simply taken matters into their own hands, literally.", "Regardless of what one's attitude towards prohibition may be, temperance is something against which, at a time of war, no reasonable protest can be made.", "At home in Ireland, there's a habit of avoidance, an ironical attitude towards the authority figure.", "Even if people do wrong, we're social animals, so what can we do about stopping them doing the same things in future? Saying people are 'bad' or 'evil' is just an unwillingness to engage an unwillingness to try to empathise. That sanctimonious attitude doesn't help anyone.", "People have often asked if I'm gay because I don't go out of my way to spit and scratch and give people attitude.", "I don't return anybody's calls unless it's going to mean extra money for me. And I've completely cut off all relationships with any friends that I had before the show. And I've copped an attitude.", "A positive attitude is something everyone can work on, and everyone can learn how to employ it.", "My feelings about my mortality are less selfish than they used to be. I used to affect a cavalier attitude to death now I see it from my son's perspective.", "The U.S. tries to provide immigrants who grow up here with a world-class education and imbue them with the can-do attitude that has long defined American innovation.", "The attitude of independence toward a constructed language which all national speakers must adopt is really a great advantage, because it tends to make man see himself as the master of language instead of its obedient servant.", "I feel like I have as good a shot as anybody out there and I have gotten close in the past, so why not have the attitude that I can come out and play great tennis and maybe even win this tournament.", "Art is the child of Nature yes, her darling child, in whom we trace the features of the mother's face, her aspect and her attitude.", "I just think that people take me a little more seriously as a brunette. I don't know if that's just because of a societal preconceived notion that all blondes are stupid, but it's a different kind of attitude.", "I came back to performing with a different attitude about performing and myself. I wasn't expecting perfection any more, just hoping for an occasional inspiration.", "The purely agitation attitude is not good enough for a detailed consideration of a subject.", "Animals have a much better attitude to life and death than we do. They know when their time has come. We are the ones that suffer when they pass, but it's a healing kind of grief that enables us to deal with other griefs that are not so easy to grab hold of.", "Only one thing can conquer war - that attitude of mind which can see nothing in war but destruction and annihilation.", "It's not too good to have this attitude in F1. It could be a disadvantage.", "I just really think every job I do, I get this gypsy attitude to money.", "My personal view is that such total planning by the state is an absolute good and not simply a relative good... I do not myself think of the attitude I take as deriving from Marx - though this undoubtedly will be suggested - but from Fichte and Hegel.", "There's a punk-rock attitude, clearly, to 'Hated.' There's even a punk-rock attitude to 'The Hangover,' I think. We start the movie with a Glenn Danzig song.", "The American attitude is 'We're the best'. That's why the NBA guys who come from other countries, the Europeans, all sort of stick together away from the game.", "The problem was just a mean attitude that festers and has to be challenged.", "I'm not anti-fashion, but I've always had a bit of a punk attitude. That's important, I think. I do my own thing.", "To so enter into it in nature and art that the enjoyed meanings of life may become a part of living is the attitude of aesthetic appreciation.", "The traditional Christian attitude toward human personality was that human nature was essentially good and that it was formed and modified by social pressures and training.", "My parents have a strong work ethic, but their attitude to life, their philosophy, is: 'whatever makes you happy.'", "Bob Altman had this relaxed but serious attitude. Everybody loved him. I wanted him to adopt me.", "The pool is terrible, but that doesn't have much to do with my record swims. That's all mental attitude.", "Fame can be just so annoying because people are so critical of you. You can't just say, 'hi'. You say hi and people whisper' man did you see the way she said hi? What an attitude.", "My dad instilled in me a great sense of humor. I wasn't bullied at school because my outward attitude was confident, and that helps.", "The attitude and capacity of the factory, the old metal table and the new ideas of the wooden furniture quickly and naturally suggested the possibility of metal furniture.", "You can measure a programmer's perspective by noting his attitude on the continuing vitality of FORTRAN.", "Let us change our traditional attitude to the construction of programs. Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do.", "It goes without saying that the Jewish people can have no other goal than Palestine and that, whatever the fate of the proposition may be, our attitude toward the land of our fathers is and shall remain unchangeable.", "That attitude toward women as objects may have worked for the late Sixties, but it doesn't do so now.", "The time I spent thinking about how I was better than somebody else or worrying about somebody else's attitude was time I could put to better use.", "I really believe you can predict when someone has a great attitude, a real well of talent.", "It is impossible to exaggerate the wide, and widening, gulf between the American attitude on the Iraq war and the view from our friends across the Atlantic.", "As a team, you need to come from behind every once in awhile just to do it. Good for the attitude. It makes it exciting. And when everybody knows you have to throw it... that makes it fun too.", "I hope 'The Voice' has a fifteen-year run, don't get me wrong. But I come from nothing, and maybe it's the Irish in me, but my attitude is always like, 'They'll figure me out soon.'", "Time plays a role in almost every decision. And some decisions define your attitude about time.", "'UFO's' attitude toward the subject is very similar to mine. It's not an advocacy its philosophy is more 'I want to believe this, but I want it proved.'", "The music is first and foremost everything - no egos, no attitude, nothing - it's about the music.", "But having said that, there's also a sea change in attitude towards media.", "In the West, you have always associated the Islamic faith 100 percent with Arab culture. This in itself is a fundamentalist attitude and it is mistaken.", "Jazz in itself is not struggling. That is, the music itself is not struggling... It's the attitude that's in trouble. My plays insist that we should not forget or toss away our history.", "As the time goes by, you change, your learn new things, your attitude is different. For the moment, I'm still enjoying ski racing so much that it would be difficult for me to think about ending my career.", "My attitude on skis is different now. I have learned to put less pressure on myself and on the edges of my skis when I'm racing, to be keep myself more under control.", "Our attitude is that we want to cross over. You can't go on making records just for your own hometown.", "I do not share the half-in, half-out attitude to the EU of some in Britain. Britain's place is in Europe.", "I think that the U.S. does have this very much more open attitude, and I admire it very much and I think it's very important to the world. But the information and the discussion sometimes come too late, after the effective decision has been made.", "The Stones are a different kind of group. I realized that when I joined them. It's not really so much their musical ability, it's just they have a certain kind of style and attitude which is unique.", "Even with, or perhaps, because of, this background, I have over the past few years sensed a very dramatic change in attitude on the part of Prince Edward Islanders towards the on-going rush for so-called modernization.", "If you're looking for can-do, earthy-crunchy attitude then you've got to go to Wisconsin.", "When I was in my 20s it did occur to me that there was something perverted about an attitude that thought that killing somebody was a minor offence compared to kissing somebody.", "You can have a laugh in Los Angeles, or you can weep in Los Angeles, depending on your attitude towards it.", "People are patronizing the theatres with renewed enthusiasm - there is an entire picnic-like attitude when families go out to see movies, which is a very good sign. They want to see larger-than-life characters on the big screen and not just watch movies on television or on DVDs.", "I just want to go in with the right attitude and from Day 1 make a difference.", "The theatre only knows what it's doing next week, not like the opera, where they say: What are we going to do in five years' time? A completely different attitude.", "I'm not a music lover in the sense that I look for something to have on. I've never had that attitude to music.", "I think one of the things that language poets are very involved with is getting away from conventional ideas of beauty, because those ideas contain a certain attitude toward women, certain attitudes toward sex, certain attitudes toward race, etc.", "When you Google me, you'll find a lot of people don't like Richard Dreyfuss. Because I'm cocky and I present a cocky attitude. But no one has ever disagreed with the notion I represent, that we need more civic education. So far there's 100 percent support for that.", "My mother, she had a very good attitude toward money. I'm very grateful for the fact that we had to learn to save. I used to get like 50 pence a week, and I'd save it for like five months. And then I'd spend it on Christmas presents. I'd save up like eight pounds. It's nothing, but we did that.", "Too many people say to their brokers, I can't deal with this. Take my money. Do what you want. That's the worst attitude you can have.", "If philosophy is practice, a demand to know the manner in which its history is to be studied is entailed: a theoretical attitude toward it becomes real only in the living appropriation of its contents from the texts.", "I am shocked by the easy attitude of many in the media towards disclosing our Nation's secrets.", "I always give Lindsay so much credit for her tennis game, for her attitude, for her person, and because of how she deals with all the things. I don't think people give her enough credit for how well she's doing.", "I don't know that I have any role models now that are fixed. Definitely my mom - she's the coolest. She's worked really hard her whole life and I just think she's got a great attitude. Moms just know so much it's so silly.", "It's tricky. I've never been standing at the top of the tree with tons of money thrown at me. I've never really had a profile. So in a way I have this 'nothing to lose' attitude.", "Lead singers not only do the majority of the work, but their personalities are singled out and taken as the general attitude of the unit.", "It's better for me to play with guys because Rock 'n' Roll has such an aggressive attitude.", "I think Nina Simone has had an amazing journey. She was spicy and she had attitude and she didn't care, she wanted her money in a paper bag and don't mess with me and I've been doing some research on that so.", "I kind of resent this attitude of men that we somehow must always look good.", "Bambi can't act. Bambi had major attitude.", "I'm a big fan of Courtney Love. I love Hole and I love her acting and I love her attitude. I just hope I never meet her in a dark alley.", "I do support a sex-positive attitude for young people. Use condoms, that's important. I love the idea that promiscuity can be healthy but it's got some dodgy crevasses. Ooh, that's a bad reference! But it's got some dangerous cavities there. You know what I'm saying.", "The war changed everybody's attitude. We became international almost overnight.", "As I wrote, I found that Aibileen had some things to say that really weren't in her character. She was older, soft-spoken, and she started showing some attitude.", "I like England more than I did when I left. It's become a bit of a better country in the last ten years, in the attitude of it. A bit more Americanized, which is both good and bad. At least when you order a cup of coffee they don't give you a hard time.", "What a stupid attitude we have in this country to personal stories.", "I have a Woody Allen Jewish attitude to life: that it's all going to be disastrous. That it hasn't all been that way is simply down to some random quirk of fate.", "My attitude toward graduate students was different, I must say. I used graduate students as colleagues: I gave them the best problems to work on, and I encouraged them.", "Tommie Aaron taught me how to have a good attitude, to be easy going and not get uptight.", "In aid, the proper attitude is one omitting gratitude.", "In Scotland over many years we have cultivated through our justice system what I hope can be described as a 'culture of compassion.' On the other hand, there still exists in many parts of the U.S., if not nationally, an attitude towards the concept of justice which can only be described as a 'culture of vengeance.'", "Any time I need to get a serious attitude adjustment, I put on one of their records, and there are examples there for all time to keep us honest and keep us reaching they'll never be eclipsed.", "I always had the attitude that I wanted to throw a no-hitter every game.", "I like actors that are good with pantomime and that can transmit a lot by their presence and attitude more than through their dialogue.", "Having a child makes you strong and gives you chutzpah. It relaxed my attitude to the job my center of focus shifted, which I think is very helpful, because even if you're not a very indulgent actor you spend a lot of time thinking about yourself. I don't think that is particularly healthy.", "I always said punk was an attitude. It was never about having a Mohican haircut or wearing a ripped T-shirt. It was all about destruction, and the creative potential within that.", "Sid Vicious began the age of participation in which everyone could be the artist. Sid proved that you don't have to play well to be the star. You can play badly, or not even at all. I endorsed that attitude. If you can't write songs, no problem - simply steal one and change it to your taste.", "Abhorrence of apartheid is a moral attitude, not a policy.", "Every baseball crowd, like every theatre audience, has its own distinctive attitude and atmosphere.", "Football is my profession now. I'm getting married in August... It's a new experience for me as someone just getting out of college. I still have the same attitude about football I always had. I play hard. I enjoy practice. I'd rather be throwing in passing drills than sitting around and watching TV.", "The attitude we have towards our personal pets as opposed to the animals that suffer under the factory farm is hypocritical and delusional.", "Certain kinds of speed, flow, intensity, density of attacks, density of interaction... Music that concentrates on those qualities is, I think, easier achieved by free improvisation between people sharing a common attitude, a common language.", "I saw 'Taxi Driver,' and 'Taxi Driver' kind of saved my life. The scene where Robert De Niro is looking at himself in the mirror saying, 'You talkin' to me? You talkin' to me? Who the hell else are you talkin' to?' That's the scene that changed my life by changing my attitude about acting.", "I've always been a guy who's pretty supportive, its just my nature, so I came in to the situation with the attitude that I wanted to support Johnny and make it work.", "I thought I was going to be killed. The casualties were so heavy, it was just a given. I learned to take each day, each mission, as it came. That's an attitude I've carried into my professional life. I take each case, each job, as it comes.", "What has happened is that to some degree they have taken an attitude where they don't listen to demos of diverse subject matters. They're looking for demos like the record the guy on the left just did.", "Here you do have forests, where pigs could be raised by letting them root about in the forests for a good part of the year. Therefore, you have a different attitude toward them compared with what continues to exist in the Middle East.", "The attitude of physiological psychology to sensations and feelings, considered as psychical elements, is, naturally, the attitude of psychology at large.", "This generation... they have a different attitude. Instead of sitting and watching something, they want to be a part of it - they're very hedonistic and sensual.", "We have become aware of the responsibility for our attitude towards the dark pages in our history. We have understood that bad service is done to the nation by those who are impelling to renounce that past.", "But I do think that we approach music, in of itself, with a religious attitude.", "I think that generally music should be a positive thing, I like Bob Marley's attitude: he said that his goal in life was to single handedly fight all the evil in the world with nothing but music, and when he went to a place he didn't go to play, he went to conquer.", "In 1977, at least, he wished to have people believe that he shared and was proud of an attitude toward women that is not acceptable in a politician. In 2003, all he has said is that he doesn't remember the interview.", "You'd like more people to recognise what you do is special. But I take the attitude that the best thing I can do for my sport is to be the best at it. The best way people will come to recognise that track and field is a great sport is to see athletes excelling at it. Which is what I intend to do.", "So at a time in which the media give the public everything it wants and desires, maybe art should adopt a much more aggressive attitude towards the public. I myself am very much inclined to take this position.", "Modern Orthodoxy has a highly positive attitude toward the State of Israel. Our Ultra-Orthodox brethren recognize only the Holy Land, but not the state.", "I just try to try to keep an attitude that I don't know what I'm doing. Not to the point where I'm beating myself up, but I just go in thinking that I have a lot to learn. And I hope I still have that attitude 30 years from now.", "I'm not going to take this defeatist attitude and listen to all this crap any more from all these people who have nothing except doomsday to predict.", "A series of rumors about my attitude, as well as derogatory remarks about myself and my family showed me that the personal resentment of the Detroit general manager toward me would make it impossible for me to continue playing hockey in Detroit.", "Before 'Gangnam Style' I was not a good attitude artist.", "Women didn't want to be on the stage with other women because they didn't want their bodies to be compared. They didn't want another female act opening for them because of this weird competitive and tokenistic attitude.", "Listen, whatever makes the movie better. That's the attitude you have to have.", "Reason is an action of the mind knowledge is a possession of the mind but faith is an attitude of the person. It means you are prepared to stake yourself on something being so.", "Hardboiled crime fiction came of age in 'Black Mask' magazine during the Twenties and Thirties. Writers like Dashiell Hammett and Raymond Chandler learnt their craft and developed a distinct literary style and attitude toward the modern world.", "I don't think people are fools, and I think they deserve a good attitude and smart entertainment.", "Hollywood's a very weird place. I think there's less of everything except for attitude.", "My agent says that I'm a 'repeat business guy.' If you hire me to come do a movie, I'll be on time, know all my material, be ready to go, have a good attitude. I'm here to work, so I get hired over and over again by the same producers. If you just be a team player on set you can work so much more often.", "What do you mean by faith? Is faith enough for Man? Should he be satisfied with faith alone? Is there no way of finding out the truth? Is the attitude of faith, of believing in something for which there can be no more than philosophic proof, the true mark of a Christian?", "I still have a young attitude.", "Elvis Costello had a brand new bag. He was a musician, but he knew all about the attitude part of it.", "The world is full of musicians who can play great, and you wouldn't cross the road to see them. It's people who have this indefinable attitude that are the good ones.", "After working for years in Hollywood where the actors have taken over, it was a real relief to get down there and not only have some children, but also have some actors that had no attitude.", "When you are facing the wilderness on your own, you have a totally different attitude to someone who works in government or who has a monthly cheque.", "If you take the contempt some Americans have for yuppies and multiply it by 10 you might come close to understanding their attitude towards the City, as they call it - London, the people of the south.", "If you go on stage with the wrong attitude, or something in your performance is off, you can lose an audience in the first minute. That first minute is crucial.", "We can do better in higher education. And it is more than just technology. It's also an attitude on the part of faculty. We need to think through how we can produce a better quality product at less cost.", "In terms of work I've always had a Bad Attitude in that I won't work anywhere which requires me to work strict hours or follow a dress code. I don't know if that's an Asperger's thing or not, I think it's just being reasonable."];
/**
 * Generate a random quote.
 *
 * @category text
 *
 * @example
 *
 * randQuote()
 *
 * @example
 *
 * randQuote({ length: 10 })
 *
 */

function randQuote(options) {
  return fake(data$s, options);
}

var data$r = ["Satin", "Giant Angora", "Tan", "Havana", "Harlequin", "Rhinelander", "Cinnamon", "American", "Florida White", "Checkered Giant", "English Lop", "Polish", "English Angora", "Belgian Hare", "Standard Chinchilla", "Giant Chinchilla", "English Spot", "Dutch"];
/**
 * Generate a random rabbit.
 *
 * @category animals
 *
 * @example
 *
 * randRabbit()
 *
 * @example
 *
 * randRabbit({ length: 10 })
 *
 */

function randRabbit(options) {
  return fake(data$r, options);
}
/**
 * Generate a random recent date.
 *
 * @category date
 *
 * @example
 *
 * randRecentDate()
 *
 * @example
 *
 * randRecentDate({ days: 10 }) // default is 1
 *
 * @example
 *
 * randRecentDate({ length: 10 })
 *
 */


function randRecentDate(options) {
  var _options$days;

  const days = (_options$days = options == null ? void 0 : options.days) != null ? _options$days : 1;

  if (days < 1) {
    throw new Error('days must be positive, use soon() instead');
  }

  const daysInMilliseconds = days * 24 * 60 * 60 * 1000;
  const to = new Date();
  const from = new Date(to.getTime() - daysInMilliseconds);
  return fake(() => randBetweenDate({
    from,
    to
  }), options);
}
/**
 * Generate a random rgb.
 *
 * @category colors
 *
 * @example
 *
 * randRgb()
 *
 * @example
 *
 * randRgb({ alpha: true }) // default is false
 *
 * @example
 *
 * randRgb({ length: 10 })
 *
 */


function randRgb(options) {
  const factory = () => {
    const [r, g, b, a] = [getRandomInRange({
      min: 0,
      max: 255
    }), getRandomInRange({
      min: 0,
      max: 255
    }), getRandomInRange({
      min: 0,
      max: 255
    }), randFloat({
      min: 0.1,
      max: 1
    })];
    return options != null && options.alpha ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  };

  return fake(factory, options);
}

var data$q = ["Admin", "Editor", "Owner", "Contributor", "Viewer", "Developer"];
/**
 * Generate a random user role
 *
 * @category user
 *
 * @example
 *
 * randRole()
 *
 * @example
 *
 * randRole({ length: 10 })
 *
 */

function randRole(options) {
  return fake(data$q, options);
}
/**
 * Generate a random routing number.
 *
 * @category finance
 *
 * @example
 *
 * randRoutingNumber()
 *
 * @example
 *
 * randRoutingNumber({ length: 10 })
 *
 */


function randRoutingNumber(options) {
  return fake(() => randNumber({
    min: 10000000,
    max: 99999999
  }), options);
}
/**
 * Generate a random semantic version.
 *
 * @category internet
 *
 * @example
 *
 * randSemver()
 *
 * @example
 *
 * randSemver({ length: 10 })
 *
 * @example
 *
 * randSemver({ prefix: 'v' })
 *
 */


function randSemver(options) {
  return fake(() => {
    const version = Array.from({
      length: 3
    }, () => randNumber({
      min: 0,
      max: 20
    })).join('.');
    return `${(options == null ? void 0 : options.prefix) || ''}${version}`;
  }, options);
}

var data$p = ["Triangle", "Circle", "Square", "Rectangle", "Parallelogram", "Rhombus", "Trapezium", "Kite", "Polygons", "Sphere", "Cube", "Cuboid", "Cone", "Cylinder"];
/**
 * Generate a random shape.
 *
 * @category general
 *
 * @example
 *
 * randShape()
 *
 * @example
 *
 * randShape({ length: 10 })
 *
 */

function randShape(options) {
  return fake(data$p, options);
}

var data$o = ["Accounting or bookkeeping", "Active listening", "Adaptability", "Analytical and problem solving", "Attention to detail", "Brand development", "Collaboration", "Communication", "Creativity", "Critical thinking", "Customer service", "Data analysis", "Data mining", "Data privacy", "Decision making", "Dependability", "Diplomacy", "Empathy", "Enterprise resource planning", "Human resources", "Leadership", "Microsoft office proficiency", "Multilingualism", "Multitasking", "Negotiation", "Organization", "Patience", "Positivity", "Problem solving", "Process automation", "Product design", "Project management", "Research skills", "Search engine optimization", "Self-motivation", "Social skills", "Software proficiency", "Storytelling", "Teamwork", "Time management", "Troubleshooting", "Typing skills", "Verbal and presentation", "Work ethic", "Writing and editing"];
/**
 * Generate a random skill.
 *
 * @category Person
 *
 * @example
 *
 * randSkill()
 *
 * @example
 *
 * randSkill({ length: 10 })
 *
 */

function randSkill(options) {
  return fake(data$o, options);
}
/**
 * Generate a random slug.
 *
 * @category Internet
 *
 * @example
 *
 * randSlug()
 *
 * @example
 *
 * randSlug({ length: 10 })
 *
 */


function randSlug(options) {
  return fake(() => {
    const numberOfWordsInSlug = getRandomInRange({
      min: 3,
      max: 10
    });
    const randomWords = randWord({
      length: numberOfWordsInSlug
    });
    return randomWords.join('-');
  }, options);
}

var data$n = ["Bluntnose viper", "Yunnan keelback", "Eastern hognose snake", "Southwestern black spitting cobra", "Machete savane", "Angolan python", "Huttons tree viper", "Eastern tiger snake", "Central ranges taipan", "Schultzes pitviper", "Mexican west coast rattlesnake", "Indigo snake", "Dog-toothed cat snake", "Bismarck ringed python", "Boomslang", "Mangshan pitviper", "Whip snake", "Mountain adder"];
/**
 * Generate a random snake.
 *
 * @category animals
 *
 * @example
 *
 * randSnake()
 *
 * @example
 *
 * randSnake({ length: 10 })
 *
 */

function randSnake(options) {
  return fake(data$n, options);
}

var data$m = [{
  name: "Triller",
  link: "https://www.triller.co/"
}, {
  name: "Periscope",
  link: "https://www.periscope.tv/"
}, {
  name: "Vimeo",
  link: "https://vimeo.com/"
}, {
  name: "Valence",
  link: "https://valence.community/"
}, {
  name: "Untappd",
  link: "https://untappd.com/"
}, {
  name: "Elpha",
  link: "https://elpha.com/"
}, {
  name: "Yubo",
  link: "https://yubo.live/"
}, {
  name: "Peanut",
  link: "https://www.peanut-app.io/"
}, {
  name: "Houseparty",
  link: "https://houseparty.com/"
}, {
  name: "Caffeine",
  link: "https://www.caffeine.tv/"
}, {
  name: "Steemit",
  link: "https://steemit.com/"
}, {
  name: "Baidu Tieba",
  link: "https://tieba.baidu.com/"
}, {
  name: "23snaps",
  link: "https://www.23snaps.com/"
}, {
  name: "Likee",
  link: "https://likee.video/"
}, {
  name: "8tracks",
  link: "https://8tracks.com/"
}, {
  name: "Academia",
  link: "https://www.academia.edu/"
}, {
  name: "Amikumu",
  link: "https://amikumu.com/"
}, {
  name: "aNobii",
  link: "https://www.anobii.com/"
}, {
  name: "ASMALLWORLD",
  link: "https://www.asmallworld.com/"
}, {
  name: "Athlinks",
  link: "https://www.athlinks.com/"
}, {
  name: "BAND",
  link: "https://band.us/en"
}, {
  name: "beBee",
  link: "https://www.bebee.com/us/"
}, {
  name: "blind",
  link: "https://www.teamblind.com/"
}, {
  name: "diaspora*",
  link: "https://diasporafoundation.org/"
}, {
  name: "Fark",
  link: "https://www.fark.com/"
}, {
  name: "MeWe",
  link: "https://mewe.com/"
}, {
  name: "Facebook",
  link: "https://www.facebook.com/"
}, {
  name: "Instagram",
  link: "https://www.instagram.com/"
}, {
  name: "Twitter",
  link: "https://twitter.com/"
}, {
  name: "Tumblr",
  link: "https://www.tumblr.com/"
}, {
  name: "LinkedIn",
  link: "https://www.linkedin.com/"
}, {
  name: "WhatsApp",
  link: "https://www.whatsapp.com/"
}, {
  name: "Snapchat",
  link: "https://www.snapchat.com/"
}, {
  name: "Pinterest",
  link: "https://www.pinterest.com/"
}, {
  name: "Reddit",
  link: "https://www.reddit.com/"
}, {
  name: "YouTube",
  link: "https://www.youtube.com/"
}, {
  name: "Mix",
  link: "https://mix.com/"
}, {
  name: "Tagged",
  link: "https://www.tagged.com/"
}, {
  name: "Nextdoor",
  link: "https://nextdoor.com/"
}, {
  name: "DeviantArt",
  link: "https://www.deviantart.com/"
}, {
  name: "Quora",
  link: "https://www.quora.com/"
}, {
  name: "Meetup",
  link: "https://www.meetup.com/"
}, {
  name: "ReverbNation",
  link: "https://www.reverbnation.com/"
}, {
  name: "Flixster",
  link: "https://www.flixster.com/"
}, {
  name: "Goodreads",
  link: "https://www.goodreads.com/"
}, {
  name: "Twitch",
  link: "https://www.twitch.tv/"
}, {
  name: "CaringBridge",
  link: "https://www.caringbridge.org/"
}, {
  name: "Wattpad",
  link: "https://www.wattpad.com/"
}, {
  name: "Viadeo",
  link: "http://www.viadeo.com/"
}, {
  name: "Crunchyroll",
  link: "https://www.crunchyroll.com/"
}, {
  name: "Skyrock",
  link: "https://www.skyrock.com/"
}, {
  name: "VK",
  link: "https://vk.com/"
}, {
  name: "MyHeritage",
  link: "https://www.myheritage.com/"
}, {
  name: "LiveJournal",
  link: "https://www.livejournal.com/"
}, {
  name: "Classmates",
  link: "https://www.classmates.com/"
}, {
  name: "SoundCloud",
  link: "https://soundcloud.com/"
}, {
  name: "Bubbly",
  link: "http://bubbly.net/"
}, {
  name: "Flickr",
  link: "https://www.flickr.com/"
}, {
  name: "We Heart It",
  link: "https://weheartit.com/"
}, {
  name: "Influenster",
  link: "https://www.influenster.com/"
}, {
  name: "FilmAffinity",
  link: "https://www.filmaffinity.com/en/main.html"
}, {
  name: "Open Diary",
  link: "https://www.opendiary.com/"
}, {
  name: "Yelp",
  link: "https://www.yelp.com/"
}, {
  name: "CollegeHumor",
  link: "http://www.collegehumor.com/"
}, {
  name: "Gaia Online",
  link: "https://www.gaiaonline.com/"
}, {
  name: "MocoSpace",
  link: "https://www.mocospace.com/"
}, {
  name: "CouchSurfing",
  link: "https://www.couchsurfing.com/"
}, {
  name: "Funny or Die",
  link: "https://www.funnyordie.com/"
}, {
  name: "italki",
  link: "https://www.italki.com/home"
}, {
  name: "eToro",
  link: "https://www.etoro.com/"
}, {
  name: "XING",
  link: "https://www.xing.com/en"
}, {
  name: "MeetMe",
  link: "https://www.meetme.com/"
}, {
  name: "Ravelry",
  link: "https://www.ravelry.com/account/login"
}, {
  name: "Care2",
  link: "https://www.care2.com/"
}, {
  name: "YY",
  link: "http://www.yy.com/"
}, {
  name: "Vero",
  link: "https://www.vero.co/"
}, {
  name: "Medium",
  link: "https://medium.com/"
}, {
  name: "GIPHY",
  link: "https://giphy.com/"
}, {
  name: "Tribe",
  link: "https://tribe.so/"
}, {
  name: "Tencent QQ",
  link: "https://www.qq.com/"
}, {
  name: "WeChat",
  link: "https://www.wechat.com/en"
}, {
  name: "Qzone",
  link: "https://qzone.qq.com/"
}, {
  name: "TikTok",
  link: "https://www.tiktok.com/trending?lang=en"
}, {
  name: "Sina Weibo",
  link: "https://www.weibo.com/overseas"
}, {
  name: "Kuaishou",
  link: "https://www.kuaishou.com/"
}, {
  name: "Skype",
  link: "https://www.skype.com/en/"
}, {
  name: "Viber",
  link: "https://www.viber.com/en/"
}, {
  name: "LINE",
  link: "https://line.me/en/"
}, {
  name: "LINE PLAY",
  link: "http://lp.play.line.me/en.html"
}, {
  name: "The Dots",
  link: "https://the-dots.com/"
}, {
  name: "Telegram",
  link: "https://telegram.org/"
}, {
  name: "Foursquare Swarm",
  link: "https://www.swarmapp.com/"
}, {
  name: "Douban",
  link: "https://www.douban.com/"
}, {
  name: "Discord",
  link: "https://discord.com/"
}, {
  name: "Badoo",
  link: "https://badoo.com/"
}, {
  name: "Myspace",
  link: "https://myspace.com/"
}, {
  name: "Mixi",
  link: "https://mixi.jp/"
}, {
  name: "Ravelry",
  link: "https://www.ravelry.com/account/login"
}, {
  name: "Cellufun",
  link: "http://www.cellufun.com/games.asp?v=59bfuWxNv00"
}, {
  name: "Xanga",
  link: "http://xanga.com/"
}, {
  name: "Imgur",
  link: "https://imgur.com/"
}, {
  name: "Ello",
  link: "https://ello.co/"
}];
/**
 * Generate random social network
 *
 * @category internet
 *
 * @example
 *
 * randSocial()
 *
 * @example
 *
 * randSocial({ length: 2 })
 *
 *
 */

function randSocial(options) {
  return fake(data$m, options);
}
/**
 * Generate a random soon.
 *
 * @category date
 *
 * @example
 *
 * randSoonDate()
 *
 * @example
 *
 * randSoonDate({ days: 5 }) // default is 1
 *
 * @example
 *
 * randSoonDate({ length: 10 })
 *
 */


function randSoonDate(options) {
  var _options$days;

  const days = (_options$days = options == null ? void 0 : options.days) != null ? _options$days : 1;

  if (days < 1) {
    throw new Error('days must be positive, use recent() instead');
  }

  const daysInMilliseconds = days * 24 * 60 * 60 * 1000;
  const from = new Date();
  const to = new Date(from.getTime() + daysInMilliseconds);
  return fake(() => randBetweenDate({
    from,
    to
  }), options);
}

var data$l = {
  olympic: ["Archery", "Artistic Gymnastics", "Artistic Swimming", "Athletics", "Badminton", "Baseball Softball", "Basketball", "Beach Volleyball", "BMX Freestyle", "BMX Racing", "Boxing", "Kayak Flatwater", "Kayak Slalom", "Diving", "Equestrian", "Fencing", "Football", "Golf", "Handball", "Hockey", "Judo", "Karate", "Marathon Swimming", "Modern Pentathlon", "Mountain Bike", "Rhythmic Gymnastics", "Road Cycling", "Rowing", "Rugby", "Sailing", "Shooting", "Skateboarding", "Sport Climbing", "Surfing", "Swimming", "Table Tennis", "Taekwondo", "Tennis", "Track Cycling", "Trampoline", "Triathlon", "Volleyball", "Water Polo", "Weightlifting", "Wrestling"],
  winterOlympic: ["Alpine Skiing", "Biathlon", "Bobsleigh", "Cross-Country Skiing", "Curling", "Figure Skating", "Freestyle Skiing", "Ice Hockey", "Luge", "Nordic Combined", "Short Track Speed Skating", "Skeleton", "Ski Jumping", "Snowboard", "Speed Skating"],
  outdoor: ["Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Bowling", "Boxing", "Camping", "Canoeing", "Climbing", "Cricket", "Curling", "Cycling", "Equestrian", "Fencing", "Football", "Golf", "Gymnastics", "Handball", "Hang Gliding", "High Jumping", "Hockey", "Ice Hockey", "Judo", "Karate", "Kite Flying", "Monkey Bars", "Motorsports", "Netball", "Rowing", "Rugby", "Running", "Sailing", "Skateboarding", "Slide", "Snow Skiing", "Soccer", "Street Hockey", "Surfing", "Swimming", "Table Tennis", "Tennis", "Trekking", "Triathlon", "Volleyball", "Weightlifting", "Wrestling"]
};

var _Object$keys;

const categoriesCount = (_Object$keys = Object.keys(data$l)) == null ? void 0 : _Object$keys.length;
/**
 * Generate a random sports.
 *
 * @category sports
 *
 * @example
 *
 * randSports()
 *
 * @example
 *
 * randSports({ category : 'olympic' })
 *
 * @example
 *
 * randSports({ length: 10 })
 *
 */

function randSports(options) {
  const sportsData = data$l;
  const category = options == null ? void 0 : options.category;

  if (!categoriesCount) {
    throw 'No Sport Categories found';
  }

  if (category && !sportsData[category]) {
    throw `No Sports found for selected category (${category})`;
  }

  const factory = () => {
    if (category) {
      return randElement(sportsData[category]);
    }

    const randIndex = getRandomInRange({
      min: 0,
      max: categoriesCount - 1,
      fraction: 0
    });
    const randomOrigin = Object.keys(sportsData)[randIndex];
    return randElement(sportsData[randomOrigin]);
  };

  return fake(factory, options);
}
/**
 * Generate a random sports team.
 *
 * @category sports
 *
 * @example
 *
 * randSportsTeam()
 *
 * @example
 *
 * randSportsTeam({ length: 10 })
 *
 */


function randSportsTeam(options) {
  const teamNameFunctions = [randAmericanFootballTeam(), randBaseballTeam(), randBasketballTeam(), randFootballTeam(), randIceHockeyTeam()];
  return fake(() => randElement(teamNameFunctions), options);
}

var data$k = ["Oklahoma", "South Dakota", "Massachusetts", "Minnesota", "Rhode Island", "Florida", "Delaware", "Utah", "Maryland", "Pennsylvania", "West Virginia", "Nevada", "New York", "Alabama", "Arizona", "Wyoming", "Washington", "Nebraska", "Mississippi", "Missouri", "Arkansas", "Vermont", "North Dakota", "Iowa", "Georgia", "Kentucky", "Wisconsin", "New Hampshire", "Hawaii", "Idaho", "Michigan", "Ohio", "Colorado", "Kansas", "Maine", "Alaska", "Indiana", "South Carolina", "Oregon", "Illinois", "Tennessee", "California", "Virginia", "Texas", "Montana", "New Jersey", "North Carolina"];
/**
 * Generate a random state.
 *
 * @category address
 *
 * @example
 *
 * randState()
 *
 * @example
 *
 * randState({ length: 10 })
 *
 */

function randState(options) {
  return fake(data$k, options);
}

var data$j = ["OR", "FL", "NM", "AK", "MO", "NE", "RI", "MI", "PA", "WI", "AL", "MA", "MN", "TN", "ND", "MS", "AR", "HI", "UT", "ID", "SC", "CA", "NJ", "CT", "OK", "AZ", "IA", "SD", "MT", "MD", "WY", "KS", "WV", "CO", "TX", "VT", "NV", "DE", "ME", "GA", "LA", "IN", "VA"];
/**
 * Generate a random state abbr.
 *
 * @category address
 *
 * @example
 *
 * randStateAbbr()
 *
 * @example
 *
 * randStateAbbr({ length: 10 })
 *
 */

function randStateAbbr(options) {
  return fake(data$j, options);
}

var data$i = [{
  status: "Pending",
  type: ["Project", "User Story"]
}, {
  status: "Todo",
  type: ["User Story", "Task"]
}, {
  status: "In progress",
  type: ["Task"]
}, {
  status: "In Discussion",
  type: ["User Story"]
}, {
  status: "In Development",
  type: ["User Story", "Task"]
}, {
  status: "Needs Confirmation",
  type: ["User Story"]
}, {
  status: "Completed",
  type: ["User Story", "Task", "Project"]
}, {
  status: "Upcoming",
  type: ["Project"]
}, {
  status: "Overdue",
  type: ["Project"]
}, {
  status: "Not started",
  type: ["Project"]
}, {
  status: "Active",
  type: ["Project"]
}, {
  status: "Priority",
  type: ["Project"]
}, {
  status: "Canceled",
  type: ["Project"]
}, {
  status: "Closed",
  type: ["Project", "Task"]
}, {
  status: "New",
  type: ["Project", "Task", "User Story"]
}, {
  status: "On hold",
  type: ["Project"]
}];
/**
 * Generate a random status.
 *
 * @category general
 *
 * @example
 *
 * randStatus()
 *
 * @example
 *
 * randStatus({ type: 'User Story' })
 *
 * @example
 *
 * randStatus({ length: 10 })
 *
 */

function randStatus(options) {
  let statuses;

  if (options != null && options.type) {
    const filteredStatuses = data$i.filter(status => {
      return status.type.includes(options.type);
    });
    statuses = filteredStatuses.map(({
      status
    }) => status).flat() || [];
  } else {
    statuses = data$i.map(({
      status
    }) => status).flat();
  }

  return fake(statuses, options);
}

var data$h = ["Basic", "Premium", "Free", "Gold", "Unlimited", "Starter", "Business", "Professional", "Advanced", "Silver", "Bronze", "Standard", "Pro", "Enterprise", "Platinum"];
/**
 * Generate a random subscription plan.
 *
 * @category company
 *
 * @example
 *
 * randSubscriptionPlan()
 *
 * @example
 *
 * randSubscriptionPlan({ length: 10 })
 *
 */

function randSubscriptionPlan(options) {
  return fake(data$h, options);
}

var data$g = [{
  realName: "Peter Parker",
  alterEgo: "Spider-man",
  company: "Marvel"
}, {
  realName: "Matt Murdock",
  alterEgo: "Daredevil",
  company: "Marvel"
}, {
  realName: "T'Challa",
  alterEgo: "Black Panther",
  company: "Marvel"
}, {
  realName: "Steve Rogers",
  alterEgo: "Captain America",
  company: "Marvel"
}, {
  realName: "Thor Odinson",
  alterEgo: "Thor",
  company: "Marvel"
}, {
  realName: "Remy Etienne LeBeau",
  alterEgo: "Gambit",
  company: "Marvel"
}, {
  realName: "James \"Logan\" Howlett",
  alterEgo: "Wolverine",
  company: "Marvel"
}, {
  realName: "Frank Castle",
  alterEgo: "Punisher",
  company: "Marvel"
}, {
  realName: "Dr. Stephen Strange",
  alterEgo: "Doctor Strange",
  company: "Marvel"
}, {
  realName: "Tony Stark",
  alterEgo: "Iron Man",
  company: "Marvel"
}, {
  realName: "Wade Wilson",
  alterEgo: "Deadpool",
  company: "Marvel"
}, {
  realName: "Steven Grant",
  alterEgo: "Moon Knight",
  company: "Marvel"
}, {
  realName: "Frog Thor",
  alterEgo: "Frog Thor",
  company: "Marvel"
}, {
  realName: "Doug Ramsey",
  alterEgo: "Cypher",
  company: "Marvel"
}, {
  realName: "Natasha Alianovna Romanova",
  alterEgo: "Black Widow",
  company: "Marvel"
}, {
  realName: "Ms. Marvel",
  alterEgo: "Carol Danvers",
  company: "Marvel"
}, {
  realName: "Shadowcat",
  alterEgo: "Kitty Pryde",
  company: "Marvel"
}, {
  realName: "Susan Storm",
  alterEgo: "Invisible Woman",
  company: "Marvel"
}, {
  realName: "Elektra Natchios",
  alterEgo: "Elektra",
  company: "Marvel"
}, {
  realName: "Janet Van Dyne",
  alterEgo: "Wasp",
  company: "Marvel"
}, {
  realName: "Clarice Ferguson",
  alterEgo: "Blink",
  company: "Marvel"
}, {
  realName: "Ororo Munroe",
  alterEgo: "Storm",
  company: "Marvel"
}, {
  realName: "Wanda Maximoff",
  alterEgo: "Scarlet Witch",
  company: "Marvel"
}, {
  realName: "Anna Marie LeBeau",
  alterEgo: "Rogue",
  company: "Marvel"
}, {
  realName: "Jennifer Walter",
  alterEgo: "She-Hulk",
  company: "Marvel"
}, {
  realName: "Silvija Sablinova",
  alterEgo: "Silver Sable",
  company: "Marvel"
}, {
  realName: "Gamora Zen Whoberi Ben Titan",
  alterEgo: "Gamora",
  company: "Marvel"
}, {
  realName: "Jessica Drew",
  alterEgo: "X-23",
  company: "Marvel"
}, {
  realName: "Bruce Wayne",
  alterEgo: "Batman",
  company: "DC"
}, {
  realName: "Clark Kent",
  alterEgo: "Superman",
  company: "DC"
}, {
  realName: "Hal Jordan",
  alterEgo: "Green Lantern",
  company: "DC"
}, {
  realName: "Barry Allen",
  alterEgo: "The Flash",
  company: "DC"
}, {
  realName: "J'onn J'onzz",
  alterEgo: "Martian Manhunter",
  company: "DC"
}, {
  realName: "Arthur Curry",
  alterEgo: "Aquaman",
  company: "DC"
}, {
  realName: "Oliver Queen",
  alterEgo: "Green Arrow",
  company: "DC"
}, {
  realName: "Ryan Choi",
  alterEgo: "The Atom",
  company: "DC"
}, {
  realName: "Carter Hall",
  alterEgo: "Hawkman",
  company: "DC"
}, {
  realName: "Nathaniel Adam",
  alterEgo: "Captain Atom",
  company: "DC"
}, {
  realName: "Jefferson Michael Pierce",
  alterEgo: "Black Lightning",
  company: "DC"
}, {
  realName: "Diana Prince",
  alterEgo: "Wonder Woman",
  company: "DC"
}, {
  realName: "Chay-Ara",
  alterEgo: "Hawkgirl",
  company: "DC"
}, {
  realName: "Tora Olafsdotter",
  alterEgo: "Ice",
  company: "DC"
}, {
  realName: "Kara Zor-El",
  alterEgo: "Supergirl",
  company: "DC"
}, {
  realName: "Jennifer-Lynn Hayden",
  alterEgo: "Jade",
  company: "DC"
}, {
  realName: "Kara Zor-L",
  alterEgo: "Power Girl",
  company: "DC"
}, {
  realName: "Dawn Granger",
  alterEgo: "Hawk",
  company: "DC"
}, {
  realName: "Dinah Lance",
  alterEgo: "Black Canary",
  company: "DC"
}, {
  realName: "Helena Bertinelli",
  alterEgo: "Huntress",
  company: "DC"
}, {
  realName: "Barbara Gordon",
  alterEgo: "Batgirl",
  company: "DC"
}, {
  realName: "Zinda Blake",
  alterEgo: "Lady Blackhawk",
  company: "DC"
}];
/**
 * Generate a random superhero.
 *
 * @category entities, comic book
 *
 * @example
 *
 * randSuperhero()
 *
 * @example
 *
 * randSuperhero({ company: 'Marvel' })
 *
 * @example
 *
 * randSuperhero({ length: 10 })
 *
 */

function randSuperhero(options) {
  const factory = () => {
    const heroes = options != null && options.company ? data$g.filter(({
      company
    }) => company === options.company) : data$g;
    return Object.assign({}, randElement(heroes), {
      id: randUuid()
    });
  };

  return fake(factory, options);
}
/**
 * Generate a random superhero name.
 *
 * @category comic book
 *
 * @example
 *
 * randSuperheroName()
 *
 * @example
 *
 * randSuperhero({ company: 'Marvel' })
 *
 * @example
 *
 * randSuperheroName({ length: 10 })
 *
 */


function randSuperheroName(options) {
  const factory = () => {
    const heroes = options != null && options.company ? data$g.filter(({
      company
    }) => company === options.company) : data$g;
    return randElement(heroes).alterEgo;
  };

  return fake(factory, options);
}

var data$f = ["<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M28,14H14c-1.1,0-2-0.9-2-2s0.9-2,2-2h1h13c0.6,0,1-0.4,1-1s-0.4-1-1-1H15h-1H7C5.9,8,5,7.1,5,6s0.9-2,2-2h14c0.6,0,1-0.4,1-1s-0.4-1-1-1H7C4.8,2,3,3.8,3,6v15c0,2.2,1.8,4,4,4h3v2c0,2.2,1.8,4,4,4h14c0.6,0,1-0.4,1-1V15C29,14.4,28.6,14,28,14z\"/><path d=\"M28,11H14c-0.6,0-1,0.4-1,1s0.4,1,1,1h14c0.6,0,1-0.4,1-1S28.6,11,28,11z\"/><path d=\"M21,5H7C6.4,5,6,5.4,6,6s0.4,1,1,1h14c0.6,0,1-0.4,1-1S21.6,5,21,5z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M31,25H10.5C8,25,6,23,6,20.5S8,16,10.5,16H31c0.6,0,1,0.4,1,1s-0.4,1-1,1H10.5C9.1,18,8,19.1,8,20.5S9.1,23,10.5,23H31 c0.6,0,1,0.4,1,1S31.6,25,31,25z\"/></g><g><path d=\"M30,25c-0.3,0-0.7-0.2-0.9-0.5c-1.4-2.5-1.4-5.5,0-8c0.3-0.5,0.9-0.6,1.4-0.4c0.5,0.3,0.6,0.9,0.4,1.4c-1.1,1.9-1.1,4.1,0,6c0.3,0.5,0.1,1.1-0.4,1.4C30.3,25,30.2,25,30,25z\"/></g><g><path d=\"M25,32H4.5C2,32,0,30,0,27.5S2,23,4.5,23H25c0.6,0,1,0.4,1,1s-0.4,1-1,1H4.5C3.1,25,2,26.1,2,27.5S3.1,30,4.5,30H25 c0.6,0,1,0.4,1,1S25.6,32,25,32z\"/></g><g><path d=\"M24,32c-0.3,0-0.7-0.2-0.9-0.5c-1.4-2.5-1.4-5.5,0-8c0.3-0.5,0.9-0.6,1.4-0.4c0.5,0.3,0.6,0.9,0.4,1.4c-1.1,1.9-1.1,4.1,0,6c0.3,0.5,0.1,1.1-0.4,1.4C24.3,32,24.2,32,24,32z\"/></g><g><path d=\"M16.9,5c-0.6,0-1-0.4-1-1c0-0.7-0.6-1.5-1.5-2l-0.2-0.1c-0.5-0.3-0.7-0.9-0.4-1.3c0.3-0.5,0.9-0.7,1.3-0.4l0.2,0.1c1.6,0.9,2.6,2.3,2.6,3.8C17.9,4.6,17.5,5,16.9,5z\"/></g><path d=\"M21.5,3.1L21.5,3.1c-1.2-0.2-2.4,0.1-3.4,0.7c-0.3,0.2-0.8,0.2-1.1,0c-0.3-0.2-0.7-0.4-1.1-0.5c0,0.2,0.1,0.5,0.1,0.7c0,0.6-0.4,1-1,1s-1-0.4-1-1c0-0.3-0.1-0.6-0.3-0.9c0,0-0.1,0-0.1,0c-2.9,0.5-4.9,3.5-4.5,6.7c0.3,2.3,1.9,5.8,3.9,7.3c0.7,0.5,1.4,0.8,2,0.8c0.1,0,0.3,0,0.4,0c0.5-0.1,0.9-0.3,1.3-0.6c0.4-0.3,1.1-0.3,1.5,0c0.4,0.3,0.9,0.5,1.3,0.6c0.8,0.1,1.6-0.1,2.5-0.7c2-1.5,3.6-5,3.9-7.3C26.3,6.6,24.3,3.5,21.5,3.1z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M14,24c0-5.5,4.5-10,10-10c1,0,2.1,0.2,3,0.5V9c0-0.6-0.4-1-1-1H11H9C7.9,8,7,7.1,7,6s0.9-2,2-2h17c0.6,0,1-0.4,1-1s-0.4-1-1-1H9C6.8,2,5,3.8,5,6v20c0,2.2,1.8,4,4,4h2h5C14.8,28.3,14,26.3,14,24z\"/><path d=\"M24,16c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S28.4,16,24,16z M27,25h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6c0.6,0,1,0.4,1,1S27.6,25,27,25z\"/><g><path d=\"M26,7H9C8.4,7,8,6.6,8,6s0.4-1,1-1h17c0.6,0,1,0.4,1,1S26.6,7,26,7z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M18.3,18.3c-3.1,3.1-3.1,8.2,0,11.3s8.2,3.1,11.3,0s3.1-8.2,0-11.3S21.5,15.2,18.3,18.3z M26.8,22.6L25.4,24l1.4,1.4c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L24,25.4l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l1.4-1.4l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l1.4,1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0C27.2,21.6,27.2,22.2,26.8,22.6z\"/><path d=\"M14,24c0-5.5,4.5-10,10-10c1,0,2.1,0.2,3,0.5V9c0-0.6-0.4-1-1-1H11H9C7.9,8,7,7.1,7,6s0.9-2,2-2h17c0.6,0,1-0.4,1-1s-0.4-1-1-1H9C6.8,2,5,3.8,5,6v20c0,2.2,1.8,4,4,4h2h5C14.8,28.3,14,26.3,14,24z\"/><g><path d=\"M26,7H9C8.4,7,8,6.6,8,6s0.4-1,1-1h17c0.6,0,1,0.4,1,1S26.6,7,26,7z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M20,24c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S22.8,24,20,24z\"/></g><path d=\"M29,5H3C2.4,5,2,5.4,2,6v20c0,0.6,0.4,1,1,1h11v-4.4c-0.6-1.1-1-2.3-1-3.6c0-3.9,3.1-7,7-7s7,3.1,7,7c0,1.3-0.4,2.5-1,3.6V27h3c0.6,0,1-0.4,1-1V6C30,5.4,29.6,5,29,5z M10,16H6c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S10.6,16,10,16z M13,12H6c-0.6,0-1-0.4-1-1s0.4-1,1-1h7c0.6,0,1,0.4,1,1S13.6,12,13,12z\"/><path d=\"M20,26c-1.5,0-2.9-0.5-4-1.3V31c0,0.3,0.2,0.6,0.4,0.8c0.3,0.2,0.6,0.2,0.9,0.1l2.7-0.9l2.7,0.9c0.1,0,0.2,0.1,0.3,0.1c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.4-0.5,0.4-0.8v-6.3C22.9,25.5,21.5,26,20,26z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M26,7H9C8.4,7,8,6.6,8,6s0.4-1,1-1h17c0.6,0,1,0.4,1,1S26.6,7,26,7z\"/></g><path d=\"M26,8H11H9C7.9,8,7,7.1,7,6s0.9-2,2-2h17c0.6,0,1-0.4,1-1s-0.4-1-1-1H9C6.8,2,5,3.8,5,6v20c0,2.2,1.8,4,4,4h2h15c0.6,0,1-0.4,1-1V9C27,8.4,26.6,8,26,8z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M24,16c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S28.4,16,24,16z M27,25h-2v2c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2h2c0.6,0,1,0.4,1,1S27.6,25,27,25z\"/><path d=\"M14,24c0-5.5,4.5-10,10-10c1,0,2.1,0.2,3,0.5V9c0-0.6-0.4-1-1-1H11H9C7.9,8,7,7.1,7,6s0.9-2,2-2h17c0.6,0,1-0.4,1-1s-0.4-1-1-1H9C6.8,2,5,3.8,5,6v20c0,2.2,1.8,4,4,4h2h5C14.8,28.3,14,26.3,14,24z\"/><g><path d=\"M26,7H9C8.4,7,8,6.6,8,6s0.4-1,1-1h17c0.6,0,1,0.4,1,1S26.6,7,26,7z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M14,24c0-5.5,4.5-10,10-10c1,0,2.1,0.2,3,0.5V9c0-0.6-0.4-1-1-1H11H9C7.9,8,7,7.1,7,6s0.9-2,2-2h17c0.6,0,1-0.4,1-1s-0.4-1-1-1H9C6.8,2,5,3.8,5,6v20c0,2.2,1.8,4,4,4h2h5C14.8,28.3,14,26.3,14,24z\"/><g><path d=\"M26,7H9C8.4,7,8,6.6,8,6s0.4-1,1-1h17c0.6,0,1,0.4,1,1S26.6,7,26,7z\"/></g><path d=\"M31.7,21.9c-0.1-0.5-0.7-0.8-1.2-0.7c-0.7,0.2-1.2,0-1.3-0.2c-0.1-0.2,0-0.7,0.5-1.3c0.4-0.4,0.4-1,0-1.4c-1-1-2.2-1.7-3.6-2.1c-0.5-0.1-1.1,0.2-1.2,0.7c-0.2,0.7-0.6,1-0.9,1s-0.6-0.4-0.9-1c-0.2-0.5-0.7-0.8-1.2-0.7c-1.4,0.4-2.6,1.1-3.6,2.1c-0.4,0.4-0.4,1,0,1.4c0.5,0.5,0.6,1,0.5,1.3c-0.1,0.2-0.6,0.4-1.3,0.2c-0.5-0.1-1.1,0.2-1.2,0.7C16.1,22.6,16,23.3,16,24s0.1,1.4,0.3,2.1c0.1,0.5,0.7,0.8,1.2,0.7c0.7-0.2,1.2,0,1.3,0.2c0.1,0.2,0,0.7-0.5,1.3c-0.4,0.4-0.4,1,0,1.4c1,1,2.2,1.7,3.6,2.1c0.5,0.1,1.1-0.2,1.2-0.7c0.2-0.7,0.6-1,0.9-1s0.6,0.4,0.9,1c0.1,0.4,0.5,0.7,1,0.7c0.1,0,0.2,0,0.3,0c1.4-0.4,2.6-1.1,3.6-2.1c0.4-0.4,0.4-1,0-1.4c-0.5-0.5-0.6-1-0.5-1.3c0.1-0.2,0.6-0.4,1.3-0.2c0.5,0.1,1.1-0.2,1.2-0.7c0.2-0.7,0.3-1.4,0.3-2.1S31.9,22.6,31.7,21.9z M24,27c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S25.7,27,24,27z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><polygon points=\"7.1,23 8.9,23 8,21.2\"/><path d=\"M13,16H3c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V18C15,16.9,14.1,16,13,16z M12.4,27.9C12.3,28,12.2,28,12,28c-0.4,0-0.7-0.2-0.9-0.6L9.9,25H6.1l-1.2,2.4c-0.2,0.5-0.8,0.7-1.3,0.4c-0.5-0.2-0.7-0.8-0.4-1.3l4-8c0.3-0.7,1.5-0.7,1.8,0l4,8C13.1,27,12.9,27.6,12.4,27.9z\"/></g><path d=\"M17,1H7C5.9,1,5,1.9,5,3v10c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V3C19,1.9,18.1,1,17,1z M12,11c0.9,0,1.7-0.4,2.2-1c0.4-0.4,1-0.5,1.4-0.1c0.4,0.4,0.5,1,0.1,1.4c-1,1.1-2.3,1.7-3.8,1.7c-2.8,0-5-2.2-5-5s2.2-5,5-5c1.4,0,2.8,0.6,3.8,1.7c0.4,0.4,0.3,1-0.1,1.4c-0.4,0.4-1,0.3-1.4-0.1c-0.6-0.7-1.4-1-2.2-1c-1.7,0-3,1.3-3,3S10.3,11,12,11z\"/><g><path d=\"M24,24h-3v2h3c0.6,0,1-0.4,1-1S24.6,24,24,24z\"/><path d=\"M25,21c0-0.6-0.4-1-1-1h-3v2h3C24.6,22,25,21.6,25,21z\"/><path d=\"M28,16H18c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V18C30,16.9,29.1,16,28,16z M27,25c0,1.7-1.3,3-3,3h-4c-0.6,0-1-0.4-1-1v-4v-4c0-0.6,0.4-1,1-1h4c1.7,0,3,1.3,3,3c0,0.8-0.3,1.5-0.8,2C26.7,23.5,27,24.2,27,25z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M28.9,9.4C28.9,9.4,28.9,9.4,28.9,9.4C28.9,9.3,29,9.2,29,9.1c0,0,0,0,0-0.1c0,0,0,0,0-0.1c0-0.1,0-0.2,0-0.3c0,0,0,0,0-0.1c0-0.1-0.1-0.2-0.1-0.3c0,0,0,0,0,0c-0.1-0.1-0.1-0.1-0.2-0.2l-11-7c-0.3-0.2-0.8-0.2-1.1,0l-13,9c0,0-0.1,0.1-0.1,0.1c0,0,0,0-0.1,0c-0.1,0.1-0.1,0.2-0.2,0.3c0,0,0,0,0,0.1C3,10.8,3,10.9,3,11c0,0,0,0,0,0v6v6c0,0.3,0.2,0.7,0.5,0.8l11,7c0.2,0.1,0.4,0.2,0.5,0.2c0.2,0,0.4-0.1,0.6-0.2l13-9c0.2-0.2,0.4-0.4,0.4-0.7s-0.1-0.6-0.3-0.8c-0.9-0.9-1.1-2.2-0.5-3.4l0.7-1.5c0-0.1,0.1-0.2,0.1-0.3c0,0,0-0.1,0-0.1c0,0,0,0,0,0c0-0.1,0-0.3-0.1-0.4c0,0,0-0.1,0-0.1c0-0.1-0.1-0.2-0.2-0.3c0,0,0,0,0,0c-0.9-0.9-1.1-2.2-0.5-3.4L28.9,9.4z M26.6,14.8l-11.6,8L5,16.5v-3.6l9.5,6c0.2,0.1,0.4,0.2,0.5,0.2c0.2,0,0.4-0.1,0.6-0.2l10.3-7.1C25.8,12.8,26,13.8,26.6,14.8z M15,28.8L5,22.5v-3.6l9.5,6c0.2,0.1,0.4,0.2,0.5,0.2c0.2,0,0.4-0.1,0.6-0.2l10.3-7.1c-0.1,1.1,0.1,2.2,0.7,3.1L15,28.8z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M16,21c-1.3,0-2.6-0.5-3.5-1.5C11.5,18.6,11,17.3,11,16s0.5-2.6,1.5-3.5c1.9-1.9,5.1-1.9,7.1,0c0.9,0.9,1.5,2.2,1.5,3.5s-0.5,2.6-1.5,3.5l0,0l0,0C18.6,20.5,17.3,21,16,21z\"/></g><path d=\"M11.1,20.9c-0.9-0.9-1.6-2.1-1.9-3.4c-2.7,2.4-5.6,4.7-8.6,6.8c-0.2,0.2-0.4,0.4-0.4,0.7c0,0.3,0.1,0.6,0.3,0.8l5.7,5.7c0.2,0.2,0.4,0.3,0.7,0.3c0,0,0.1,0,0.1,0c0.3,0,0.6-0.2,0.7-0.4c2.1-3,4.4-5.9,6.8-8.6C13.2,22.5,12,21.9,11.1,20.9z\"/><path d=\"M31.5,6.1l-5.7-5.7c-0.2-0.2-0.5-0.3-0.8-0.3c-0.3,0-0.6,0.2-0.7,0.4c-2.1,3-4.4,5.9-6.8,8.6c1.3,0.3,2.4,0.9,3.4,1.9c0.9,0.9,1.6,2.1,1.9,3.4c2.7-2.4,5.6-4.7,8.6-6.8c0.2-0.2,0.4-0.4,0.4-0.7C31.9,6.6,31.7,6.3,31.5,6.1z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M29,2H3C2.4,2,2,2.4,2,3v18c0,0.6,0.4,1,1,1h8.6l-2.6,7.7c-0.2,0.5,0.1,1.1,0.6,1.3c0.5,0.2,1.1-0.1,1.3-0.6l1.4-4.3h7.2l1.4,4.3c0.1,0.4,0.5,0.7,0.9,0.7c0.1,0,0.2,0,0.3-0.1c0.5-0.2,0.8-0.7,0.6-1.3L20.4,22H29c0.6,0,1-0.4,1-1V3C30,2.4,29.6,2,29,2zM18.9,24h-5.9l0.7-2h4.6L18.9,24z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M6,19v8c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3v-8H6z M21,24c0,1.7-1.3,3-3,3h-4c-1.7,0-3-1.3-3-3v-2c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1V24z\"/><g><path d=\"M22,7.-3C26,11.1,24.4,8.5,22,7.1z\"/><path d=\"M10,7.1c-2.4,1.4-4,4-4,6.9v3h4V7.1z\"/></g><g><path d=\"M19,8h-6c-0.6,0-1-0.4-1-1V5c0-1.7,1.3-3,3-3h2c1.7,0,3,1.3,3,3v2C20,7.6,19.6,8,19,8z M14,6h4V5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1V6z\"/></g><path d=\"M18,6h-4c-0.7,0-1.4,0.1-2,0.3V7v1v9h8V8V7V6.3C19.4,6.1,18.7,6,18,6z\"/><g><path d=\"M4,18.2c-1.2,0.4-2,1.5-2,2.8v4c0,1.3,0.8,2.4,2,2.8V18.2z\"/></g><g><path d=\"M28,18.2v9.6c1.2-0.4,2-1.5,2-2.8v-4C30,19.7,29.2,18.6,28,18.2z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M27,3H11C9.3,3,8,4.8,8,7v14H7c-1.7,0-3,1.8-3,4s1.3,4,3,4h16c1.7,0,3-1.8,3-4V8h3c0.6,0,1-0.4,1-1C30,4.8,28.7,3,27,3zM12,10h6c0.6,0,1,0.4,1,1s-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1S11.4,10,12,10z M12,13h3c0.6,0,1,0.4,1,1s-0.4,1-1,1h-3c-0.6,0-1-0.4-1-1S11.4,13,12,13z M20.4,27H7c-0.4,0-1-0.8-1-2s0.6-2,1-2h13.4c-0.3,0.6-0.4,1.3-0.4,2S20.2,26.4,20.4,27z M26.1,6c0.2-0.6,0.6-1,0.9-1s0.6,0.4,0.9,1H26.1z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M11,1H9C7.3,1,6,2.3,6,4v1h4c0.6,0,1,0.4,1,1s-0.4,1-1,1H6v3h3c0.6,0,1,0.4,1,1s-0.4,1-1,1H6v3h4c0.6,0,1,0.4,1,1s-0.4,1-1,1H6v3h3c0.6,0,1,0.4,1,1s-0.4,1-1,1H6v3h4c0.6,0,1,0.4,1,1s-0.4,1-1,1H6v1c0,1.7,1.3,3,3,3h2c1.7,0,3-1.3,3-3V4C14,2.3,12.7,1,11,1z\"/><g><path d=\"M26,6V4c0-1.7-1.3-3-3-3h-2c-1.7,0-3,1.3-3,3v2H26z\"/><path d=\"M18,8v18c0,0.2,0.1,0.4,0.2,0.6l3,4c0.2,0.3,0.5,0.4,0.8,0.4s0.6-0.1,0.8-0.4l3-4c0.1-0.2,0.2-0.4,0.2-0.6V8H18z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M23,28L23,28c-1.1,0-2.1-0.7-2.5-1.8c0-0.1,0-0.2-0.1-0.2h-8.9c0,0.1,0,0.2-0.1,0.2C11.1,27.3,10.1,28,9,28h0c-0.6,0-1,0.4-1,1s0.4,1,1,1h14c0.6,0,1-0.4,1-1S23.6,28,23,28z\"/><path d=\"M27,3H5C3.3,3,2,4.3,2,6v15c0,1.7,1.3,3,3,3h6.9h8.1H27c1.7,0,3-1.3,3-3V6C30,4.3,28.7,3,27,3z\"/></g><path class=\"st0\" d=\"M15,20V10c0-1.7-1.3-3-3-3H7C6.4,7,6,7.4,6,8v8c0,0.6,0.4,1,1,1h5C13.7,17,15,18.3,15,20L15,20\"/><path class=\"st0\" d=\"M17,20V10c0-1.7,1.3-3,3-3h5c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1h-5C18.3,17,17,18.3,17,20L17,20\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M19,22V12c0-1.7-1.3-3-3-3h-5c-0.6,0-1,0.4-1,1v8c0,0.6,0.4,1,1,1h5C17.7,19,19,20.3,19,22L19,22\"/><path d=\"M20,22V12c0-1.7,1.3-3,3-3h5c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1h-5C21.3,19,20,20.3,20,22L20,22\"/><path d=\"M16,22H6H4V8h2h10h2V5c0-1.7-1.3-3-3-3H5C3.3,2,2,3.3,2,5v22c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3v-5H16z M11,27H9c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S11.6,27,11,27z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M19.1,11.1c-0.1-0.2-0.3-0.3-0.4-0.3c-0.9,0.2-1.7,0-2-0.5c-0.3-0.5-0.1-1.3,0.6-2c0.1-0.1,0.1-0.4,0-0.5c-0.9-0.9-2-1.6-3.3-1.9c-0.2-0.1-0.4,0.1-0.5,0.3C13.2,7,12.6,7.6,12,7.6S10.8,7,10.5,6.1c-0.1-0.2-0.3-0.3-0.5-0.3c-1.3,0.3-2.4,1-3.3,1.9c-0.1,0.1-0.1,0.4,0,0.5c0.6,0.7,0.9,1.5,0.6,2c-0.3,0.5-1.1,0.7-2,0.5c-0.2,0-0.4,0.1-0.4,0.3c-0.2,0.6-0.3,1.3-0.3,1.9s0.1,1.3,0.3,1.9c0.1,0.2,0.3,0.3,0.4,0.3c0.9-0.2,1.7,0,2,0.5c0.3,0.5,0.1,1.3-0.6,2c-0.1,0.1-0.1,0.4,0,0.5c0.9,0.9,2,1.6,3.3,1.9c0,0,0.1,0,0.1,0c0.2,0,0.3-0.1,0.4-0.3c0.3-0.9,0.8-1.5,1.5-1.5s1.2,0.6,1.5,1.5c0.1,0.2,0.3,0.3,0.5,0.3c1.3-0.3,2.4-1,3.3-1.9c0.1-0.1,0.1-0.4,0-0.5c-0.6-0.7-0.9-1.5-0.6-2c0.3-0.5,1.1-0.7,2-0.5c0.2,0,0.4-0.1,0.4-0.3c0.2-0.6,0.3-1.3,0.3-1.9S19.3,11.7,19.1,11.1z M12.9,13.4c-0.1,0.1-0.1,0.2-0.2,0.3C12.5,13.9,12.3,14,12,14c-0.1,0-0.3,0-0.4-0.1c-0.1-0.1-0.2-0.1-0.3-0.2c-0.1-0.1-0.2-0.2-0.2-0.3c0-0.1-0.1-0.3-0.1-0.4c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0c0.1,0.1,0.2,0.2,0.2,0.3c0,0.1,0.1,0.3,0.1,0.4C13,13.1,13,13.3,12.9,13.4z\"/><path d=\"M28.9,17.6L26,11.8C25.9,6.4,21.4,2,16,2c-2.4,0-4.6,0.8-6.4,2.3C10.4,4.1,11.2,4,12,4c5,0,9,4,9,9c0,5-4,9-9,9c-1.1,0-2.1-0.2-3-0.5V27c0,0.5,0.3,0.9,0.8,1l10,2c0.1,0,0.1,0,0.2,0c0.2,0,0.5-0.1,0.6-0.2c0.2-0.2,0.4-0.5,0.4-0.8v-4h2c1.7,0,3-1.3,3-3v-3h2c0.3,0,0.7-0.2,0.9-0.5S29,17.9,28.9,17.6z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M6,7H0.9C0.4,7,0,7.4,0,7.9v9.1C0,17.6,0.4,18,0.9,18H6c1.7,0,3,1.3,3,3V10C9,8.3,7.7,7,6,7z\"/><path d=\"M18.1,7H13c-1.7,0-3,1.3-3,3v11c0-1.7,1.3-3,3-3h5.1c0.5,0,0.9-0.4,0.9-0.9V7.9C19,7.4,18.6,7,18.1,7z\"/></g><path d=\"M31.9,17.6L29,11.8C28.9,6.4,24.4,2,19,2c-2.8,0-5.4,1.2-7.3,3.2C12.1,5.1,12.5,5,13,5h5.1C19.7,5,21,6.3,21,7.9v9.1c0,1.6-1.3,2.9-2.9,2.9H13c-0.6,0-1,0.4-1,1v6c0,0.5,0.3,0.9,0.8,1l10,2c0.1,0,0.1,0,0.2,0c0.2,0,0.5-0.1,0.6-0.2c0.2-0.2,0.4-0.5,0.4-0.8v-4h2c1.7,0,3-1.3,3-3v-3h2c0.3,0,0.7-0.2,0.9-0.5S32,17.9,31.9,17.6z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M30.3,17.4c0-0.1,0-0.2,0-0.3l-3.6-9.7C26.2,6,25.1,5.2,23.7,5c-1.4-0.2-2.7,0.3-3.5,1.4c-0.3,0.4-0.2,1.1,0.2,1.4c0.4,0.3,1.1,0.2,1.4-0.2c0.4-0.5,1-0.8,1.6-0.7C24.1,7,24.6,7.4,24.8,8l2.4,6.6c-1-0.4-2.1-0.7-3.2-0.7c-3.1,0-5.8,1.8-6.7,4.2c-0.9-0.2-1.8-0.2-2.7,0C13.8,15.8,11.1,14,8,14c-1.2,0-2.3,0.2-3.2,0.7L7.2,8c0.2-0.6,0.7-1,1.4-1.1c0.6-0.1,1.2,0.2,1.6,0.7c0.3,0.4,1,0.5,1.4,0.2s0.5-1,0.2-1.4C11,5.3,9.7,4.8,8.3,5C6.9,5.2,5.8,6,5.3,7.3l-3.6,9.7c0,0.1,0,0.2,0,0.3C1.3,18.2,1,19.1,1,20c0,3.3,3.1,6,7,6c3.8,0,6.9-2.6,7-5.8c0.7-0.2,1.4-0.2,2,0c0.1,3.2,3.2,5.8,7,5.8c3.9,0,7-2.7,7-6C31,19.1,30.7,18.2,30.3,17.4z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M27,8V7c0-3.4-4.8-6-11-6S5,3.6,5,7v1c-1.7,0-3,1.3-3,3v3c0,0.6,0.4,1,1,1s1-0.4,1-1v-3c0-0.6,0.4-1,1-1v6.2c-1.2,0.4-2,1.5-2,2.8v6c0,0.6,0.4,1,1,1v1c0,1.7,1.3,3,3,3h1c1.7,0,3-1.3,3-3v-1h10v1c0,1.7,1.3,3,3,3h1c1.7,0,3-1.3,3-3v-1c0.6,0,1-0.4,1-1v-6c0-1.3-0.8-2.4-2-2.8V10c0.6,0,1,0.4,1,1v3c0,0.6,0.4,1,1,1s1-0.4,1-1v-3C30,9.3,28.7,8,27,8z M26,21c0,0.6-0.4,1-1,1h-1c-0.6,0-1-0.4-1-1s0.4-1,1-1h1C25.6,20,26,20.4,26,21z M25,16h-3h-3.6H17v-6h8V16z M21,5.8c0-0.1,0-0.1,0.1-0.2c0-0.1,0.1-0.1,0.1-0.2c0,0,0.1-0.1,0.1-0.1c0.4-0.4,1-0.4,1.4,0c0,0,0.1,0.1,0.1,0.1c0,0.1,0.1,0.1,0.1,0.2c0,0.1,0,0.1,0.1,0.2c0,0.1,0,0.1,0,0.2c0,0.1,0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.2,0.2-0.3,0.2S22.1,7,22,7c-0.1,0-0.3,0-0.4-0.1c-0.1,0-0.2-0.1-0.3-0.2C21.1,6.5,21,6.3,21,6C21,5.9,21,5.9,21,5.8z M13,5h6c0.6,0,1,0.4,1,1s-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1S12.4,5,13,5z M9,5.8c0-0.1,0-0.1,0.1-0.2c0-0.1,0.1-0.1,0.1-0.2c0,0,0.1-0.1,0.1-0.1c0.4-0.4,1-0.4,1.4,0c0,0,0.1,0.1,0.1,0.1c0,0.1,0.1,0.1,0.1,0.2c0,0.1,0,0.1,0.1,0.2c0,0.1,0,0.1,0,0.2c0,0.1,0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.2,0.2-0.3,0.2S10.1,7,10,7C9.9,7,9.7,7,9.6,6.9c-0.1,0-0.2-0.1-0.3-0.2C9.1,6.5,9,6.3,9,6C9,5.9,9,5.9,9,5.8z M7,10h8v6h-1.4H10H7V10z M7,20h1c0.6,0,1,0.4,1,1s-0.4,1-1,1H7c-0.6,0-1-0.4-1-1S6.4,20,7,20z M19.3,24h-6.5c-0.7,0-1.3-0.7-1.1-1.4l0.9-3.6c0.1-0.6,0.5-0.9,1-0.9h4.9c0.4,0,0.8,0.4,1,1l0.9,3.6C20.5,23.3,20,24,19.3,24z\"/></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><g><path d=\"M16,6c-2.9,0-5-1.3-5-3s2.1-3,5-3s5,1.3,5,3S18.9,6,16,6z\"/></g><g><path d=\"M16,24.6c2.3,0,4.1-0.6,5-1.3V6.6C19.8,7.5,18,8,16,8s-3.8-0.5-5-1.4v16.7C11.9,24,13.7,24.6,16,24.6z\"/><path d=\"M16,26.9c-1.7,0-3.2-0.3-4.5-0.7l3.6,5.4c0.2,0.3,0.5,0.4,0.8,0.4s0.6-0.2,0.8-0.4l3.6-5.4C19.2,26.6,17.7,26.9,16,26.9z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M29,9H3c-0.6,0-1,0.4-1,1v16c0,0.6,0.4,1,1,1h26c0.6,0,1-0.4,1-1V10C30,9.4,29.6,9,29,9z M15,23H7c-0.6,0-1-0.4-1-1c0-1.9,1-3.5,2.5-4.3C8.2,17.2,8,16.6,8,16c0-1.7,1.3-3,3-3s3,1.3,3,3c0,0.6-0.2,1.2-0.5,1.7C15,18.5,16,20.1,16,22C16,22.6,15.6,23,15,23z M25,21h-3c-0.6,0-1-0.4-1-1s0.4-1,1-1h3c0.6,0,1,0.4,1,1S25.6,21,25,21z M25,17h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6c0.6,0,1,0.4,1,1S25.6,17,25,17z\"/><g><path d=\"M20,11h-8c-0.6,0-1-0.4-1-1V9c0-2.8,2.2-5,5-5s5,2.2,5,5v1C21,10.6,20.6,11,20,11z M13,9h6c0-1.7-1.3-3-3-3S13,7.3,13,9z\"/></g></svg>", "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 32 32;\" xml:space=\"preserve\"><style type=\"text/css\">.st0{fill:#FFFFFF;}</style><path d=\"M30.4,6.5c-0.2-1.1-0.8-2.3-1.7-3.2c-0.9-0.9-2-1.5-3.2-1.7c-1.2-0.2-2.4,0.2-3.2,1c0,0,0,0,0,0c0,0,0,0,0,0c-2.8,3.3-5.8,6.5-8.9,9.6c-0.2,0-0.5,0-0.7,0.1c-0.4,0.2-0.5,0.6-0.4,1c-3.1,3.1-6.3,6.1-9.7,9c-0.8,0.8-1.1,1.9-1,3.2c0.2,1.1,0.8,2.3,1.7,3.2c0.9,0.9,2,1.5,3.2,1.7c0.2,0,0.4,0,0.6,0c1,0,1.9-0.4,2.6-1.1c2.4-2.7,4.8-5.3,7.3-7.9V25c0,0.6,0.4,1,1,1s1-0.4,1-1v-4.9c0.7,1,1,2.4,1,4.4V29c0,0.6,0.4,1,1,1s1-0.4,1-1v-4.5c0-1.9-0.2-4.4-1.9-6.2c3-3,6.1-5.9,9.3-8.6c0,0,0,0,0,0c0,0,0,0,0,0C30.2,8.9,30.6,7.7,30.4,6.5z M25.5,10.4c-2.4,2.2-4.8,4.4-7.1,6.7c-0.1,0-0.2-0.1-0.3-0.1c-1.1-0.9-2.5-2.2-3.4-3.3c2.3-2.4,4.6-4.8,6.8-7.2c0.3,0.9,0.8,1.8,1.5,2.5C23.8,9.6,24.6,10.2,25.5,10.4z M8.2,28c-0.5,0.5-1.1,0.4-1.5,0.4c-0.7-0.1-1.5-0.5-2.1-1.1c-0.6-0.6-1-1.3-1.1-2.1c-0.1-0.4-0.1-1,0.3-1.4c3.2-2.8,6.4-5.7,9.4-8.7c1.1,1.3,2.5,2.6,3.6,3.5C13.9,21.7,11,24.8,8.2,28z\"/></svg>"];
/**
 * Generate a random svg.
 *
 * @category general
 *
 * @example
 *
 * randSvg()
 *
 * @example
 *
 * randSvg({ length: 10 })
 *
 */

function randSvg(options) {
  return fake(data$f, options);
}

var data$e = ["America/Lima", "America/Juneau", "Pacific/Auckland", "Europe/Warsaw", "Europe/London", "Asia/Taipei", "Asia/Shanghai", "Pacific/Majuro", "Asia/Tashkent", "America/Caracas", "Africa/Harare", "America/La_Paz", "Europe/Vilnius", "Asia/Tokyo", "Australia/Brisbane", "Africa/Casablanca", "Atlantic/South_Georgia", "Europe/Riga", "Asia/Baku", "America/St_Johns", "Asia/Riyadh", "Europe/Bratislava", "Europe/Rome", "Asia/Dhaka", "Asia/Kolkata", "Europe/Berlin", "America/Chicago", "America/Phoenix", "Asia/Seoul", "Australia/Melbourne", "Asia/Baghdad", "Asia/Karachi", "America/New_York", "Asia/Krasnoyarsk", "Europe/Paris", "America/Mexico_City", "Europe/Moscow", "Europe/Madrid", "Africa/Johannesburg", "Europe/Athens", "Asia/Tehran", "Pacific/Port_Moresby", "Europe/Bucharest", "Asia/Singapore", "America/Denver", "Europe/Prague", "Africa/Cairo", "Asia/Kamchatka", "Europe/Stockholm", "America/Santiago", "Africa/Nairobi", "Asia/Kuala_Lumpur", "Europe/Lisbon", "America/Monterrey", "Europe/Vienna", "America/Argentina/Buenos_Aires", "Europe/Dublin", "Europe/Copenhagen", "Pacific/Apia", "Europe/Zagreb", "America/Mazatlan", "America/Guyana", "America/Tijuana", "Africa/Monrovia", "Europe/Minsk", "Pacific/Honolulu", "America/Indiana/Indianapolis"];
/**
 * Generate a random time zone.
 *
 * @category address
 *
 * @example
 *
 * randTimeZone()
 *
 * @example
 *
 * randTimeZone({ length: 10 })
 *
 */

function randTimeZone(options) {
  return fake(data$e, options);
}
/**
 * Generate a random todo.
 *
 * @category entities
 *
 * @example
 *
 * randTodo()
 *
 * @example
 *
 * randTodo({ length: 10 })
 *
 */


function randTodo(options) {
  return fake(() => {
    return {
      id: randUuid(),
      title: randText({
        charCount: 40
      }),
      completed: randBoolean()
    };
  }, options);
}

var data$d = ["deposit", "withdrawal", "payment", "invoice"];
/**
 * Generate a random transaction type.
 *
 * @category Finance
 *
 * @example
 *
 * randTransactionType()
 *
 * @example
 *
 * randTransactionType({ length: 10 })
 *
 */

function randTransactionType(options) {
  return fake(data$d, options);
}
/**
 * Generate a random url.
 *
 * @category internet
 *
 * @example
 *
 * randUrl()
 *
 * @example
 *
 * randUrl({ length: 10 })
 *
 */


function randUrl(options) {
  return fake(() => {
    return `${fake(['http', 'https'])}://${randWord()}.${randDomainSuffix()}`;
  }, options);
}

var data$c = ["Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/538.2.0 (KHTML, like Gecko) Chrome/32.0.862.0 Safari/538.2.0", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.2; Trident/4.1; .NET CLR 1.3.78921.4)", "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_8 rv:3.0; RU) AppleWebKit/537.2.2 (KHTML, like Gecko) Version/7.1.6 Safari/537.2.2", "Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/535.1.1 (KHTML, like Gecko) Chrome/38.0.882.0 Safari/535.1.1", "Mozilla/5.0 (Windows; U; Windows NT 5.3) AppleWebKit/536.1.1 (KHTML, like Gecko) Chrome/30.0.896.0 Safari/536.1.1", "Mozilla/5.0 (Windows NT 6.3; rv:15.9) Gecko/20100101 Firefox/15.9.2", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/6.0)", "Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/537.0.1 (KHTML, like Gecko) Chrome/16.0.885.0 Safari/537.0.1", "Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/532.2.1 (KHTML, like Gecko) Chrome/34.0.818.0 Safari/532.2.1", "Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/536.1.2 (KHTML, like Gecko) Chrome/15.0.867.0 Safari/536.1.2", "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko", "Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:13.0) Gecko/20100101 Firefox/13.0.0", "Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/538.0.1 (KHTML, like Gecko) Chrome/14.0.814.0 Safari/538.0.1", "Mozilla/5.0 (Windows; U; Windows NT 5.3) AppleWebKit/532.0.2 (KHTML, like Gecko) Chrome/33.0.871.0 Safari/532.0.2", "Mozilla/5.0 (Windows; U; Windows NT 5.3) AppleWebKit/537.2.0 (KHTML, like Gecko) Chrome/35.0.864.0 Safari/537.2.0", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.3; Trident/6.1; .NET CLR 4.8.82855.9)", "Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/537.1.1 (KHTML, like Gecko) Chrome/21.0.863.0 Safari/537.1.1", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/6.1; .NET CLR 2.7.77884.9)"];
/**
 * Generate a random user agent.
 *
 * @category internet
 *
 * @example
 *
 * randUserAgent()
 *
 * @example
 *
 * randUserAgent({ length: 10 })
 *
 */

function randUserAgent(options) {
  return fake(data$c, options);
}

var data$b = ["Toyota Volt", "Rolls Royce XC90", "Nissan Fiesta", "Mercedes Benz A4", "Bugatti 1", "Mini Explorer", "Nissan Spyder", "Kia Spyder", "Ford Camry", "Bugatti Corvette", "Toyota A4", "Toyota Challenger", "Smart Focus", "Mazda Challenger", "Lamborghini F-150", "Lamborghini Prius", "Hyundai Roadster", "Chevrolet Malibu"];
/**
 * Generate a random vehicle.
 *
 * @category vehicle
 *
 * @example
 *
 * randVehicle()
 *
 * @example
 *
 * randVehicle({ length: 10 })
 *
 */

function randVehicle(options) {
  return fake(data$b, options);
}

var data$a = ["Gasoline", "Hybrid", "Electric", "Diesel"];
/**
 * Generate a random vehicle fuel.
 *
 * @category vehicle
 *
 * @example
 *
 * randVehicleFuel()
 *
 * @example
 *
 * randVehicleFuel({ length: 10 })
 *
 */

function randVehicleFuel(options) {
  return fake(data$a, options);
}

var data$9 = ["Abarth", "Acura", "Alpine", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "Cadillac", "Caterham", "Chrysler", "Citroën", "Chevrolet", "Dacia", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Hennessey", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes Benz", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Pagani", "Peugeot", "Plymouth", "Polestar", "Pontiac", "Porsche", "Renault", "Rimac", "Rolls Royce", "SEAT", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"];
/**
 * Generate a random vehicle manufacturer.
 *
 * @category vehicle
 *
 * @example
 *
 * randVehicleManufacturer()
 *
 * @example
 *
 * randVehicleManufacturer({ length: 10 })
 *
 */

function randVehicleManufacturer(options) {
  return fake(data$9, options);
}

var data$8 = ["296 GTB", "4Runner", "500", "718", "911", "A-Class", "A2", "A3", "A4", "A6", "A7", "A8", "Accord", "Alpine", "Arteon", "Atlas", "Avalon", "Aventador", "Aviator", "Blazer", "Bronco", "C-Class", "C-HR", "Camaro", "Camry", "Cayenne", "Chiron", "Civic", "Clarity", "Clubman", "Colorado", "Corolla", "Corsair", "Corvette", "Countryman", "CR-V", "CT-4", "CT-5", "CX-9", "Duster", "e-tron", "E-Class", "Edge", "Elantra", "Escalade", "EQS", "EV-6", "Expedition", "Explorer", "F-150", "Fiesta", "Forester", "Ghibli", "Giulia", "GR86", "Grand Cherokee", "Grecale", "Golf", "Highlander", "HR-V", "Huracan", "ID.4", "Impreza", "Insight", "Ioniq", "Jetta", "John Cooper Works", "Kona", "Land Cruiser", "Legacy", "Levante", "Logan", "Lyriq", "M3", "M4", "M5", "Macan", "Malibu", "Maverick", "Mirai", "Model 3", "Model S", "Model X", "Model Y", "Mustang", "Nautilus", "Navigator", "Niro", "Outback", "Odyssey", "Palisade", "Panamera", "Passat", "Passport", "Portofino", "Prius", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Quattroporte", "Ranger", "R8", "RAV4", "Rio", "Roma", "S-Class", "Sandero", "Santa fe", "Sequoia", "Sentra", "Sienna", "Silverado", "Sonata", "Sorento", "Spark", "Sportage", "Spring", "Stelvio", "Stinger", "Suburban", "Super Duty", "Supra", "Tacoma", "Tahoe", "Tacoma", "Taos", "Taurus", "Taycan", "Tiguan", "Tonale", "Touareg", "Trailblazer", "TT", "Tucson", "Tundra", "Urus", "Veloster", "Venza", "Veyron", "Wrangler", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XT4", "XT5", "Yaris", "Z4"];
/**
 * Generate a random vehicle model.
 *
 * @category vehicle
 *
 * @example
 *
 * randVehicleModel()
 *
 * @example
 *
 * randVehicleModel({ length: 10 })
 *
 */

function randVehicleModel(options) {
  return fake(data$8, options);
}

var data$7 = ["Sedan", "Crew Cab Pickup", "Minivan", "Extended Cab Pickup", "Wagon", "SUV", "Cargo Van", "Coupe", "Hatchback", "Convertible", "Passenger Van"];
/**
 * Generate a random vehicle type.
 *
 * @category vehicle
 *
 * @example
 *
 * randVehicleType()
 *
 * @example
 *
 * randVehicleType({ length: 10 })
 *
 */

function randVehicleType(options) {
  return fake(data$7, options);
}

var data$6 = ["bypass", "index", "transmit", "parse", "synthesize", "compress", "reboot", "quantify", "hack", "back up", "program", "generate", "override", "input", "connect", "copy", "calculate", "navigate"];
/**
 * Generate a random verb.
 *
 * @category text
 *
 * @example
 *
 * randVerb()
 *
 * @example
 *
 * randVerb({ length: 10 })
 *
 */

function randVerb(options) {
  return fake(data$6, options);
}

var data$5 = ["Monday", "Tuesday", "Wedneday", "Thursday", "Friday", "Saturday", "Sunday"];
/**
 * Generate a random weekday.
 *
 * @category date
 *
 * @example
 *
 * randWeekday()
 *
 * @example
 *
 * randWeekday({ length: 10 })
 *
 */

function randWeekday(options) {
  return fake(data$5, options);
}

var data$4 = ["Mary J. Blige", "Steven Tyler", "Stevie Nicks", "Joe Cocker", "B.B. King", "Patti LaBelle", "Karen Carpenter", "Annie Lennox", "Morrissey", "Levon Helm", "The Everly Brothers", "Solomon Burke", "Willie Nelson", "Don Henley", "Art Garfunkel", "Sam Moore", "Darlene Love", "Patti Smith", "Tom Waits", "John Lee Hooker", "Frankie Valli", "Mariah Carey", "Sly Stone", "Merle Haggard", "Steve Perry", "Iggy Pop", "James Taylor", "Dolly Parton", "John Fogerty", "Toots Hibbert", "Gregg Allman", "Ronnie Spector", "Wilson Pickett", "Jerry Lee Lewis", "Thom Yorke", "David Ruffin", "Axl Rose", "Dion", "Lou Reed", "Roger Daltrey", "Björk", "Rod Stewart", "Christina Aguilera", "Eric Burdon", "Mavis Staples", "Paul Rodgers", "Luther Vandross", "Muddy Waters", "Brian Wilson", "Gladys Knight", "Bonnie Raitt", "Donny Hathaway", "Buddy Holly", "Jim Morrison", "Patsy Cline", "Kurt Cobain", "Bobby Blue Bland", "George Jones", "Joni Mitchell", "Chuck Berry", "Curtis Mayfield", "Jeff Buckley", "Elton John", "Neil Young", "Bruce Springsteen", "Dusty Springfield", "Whitney Houston", "Steve Winwood", "Bono", "Howlin' Wolf", "Prince", "Nina Simone", "Janis Joplin", "Hank Williams", "Jackie Wilson", "Michael Jackson", "Van Morrison", "David Bowie", "Etta James", "Johnny Cash", "Smokey Robinson", "Bob Marley", "Freddie Mercury", "Tina Turner", "Mick Jagger", "Robert Plant", "Al Green", "Roy Orbison", "Little Richard", "Paul McCartney", "James Brown", "Stevie Wonder", "Otis Redding", "Bob Dylan", "Marvin Gaye", "John Lennon", "Sam Cooke", "Elvis Presley", "Ray Charles", "Aretha Franklin"];
/**
 * Generate a random singer.
 *
 * @category music
 *
 * @example
 *
 * randSinger()
 *
 * @example
 *
 * randSinger({ length: 10 })
 *
 */

function randSinger(options) {
  return fake(data$4, options);
}

var data$3 = ["The twist", "Smooth", "Mack the knife", "Uptown funk!", "How do i live", "Party rock anthem", "I gotta feeling", "Macarena (bayside boys mix)", "Shape of you", "Physical", "You light up my life", "Hey jude", "Closer", "We belong together", "Un-break my heart", "Yeah!", "Bette davis eyes", "Endless love", "Tonight’s the night (gonna be alright)", "You were meant for me/foolish games", "(everything i do) i do it for you", "I’ll make love to you", "The theme from “a summer place”", "Le freak", "How deep is your love", "Eye of the tiger", "We found love", "Low", "Just want to be your everything", "Too close", "Every breath you take", "Somebody that i used to know", "Despacito", "Flashdance… what a feeling", "Rolling in the deep", "Tossin’ and turnin’", "The battle of new orleans", "One sweet day", "Truly madly deeply", "Silly love songs", "Let’s get it on", "Night fever", "Another one bites the dust", "Say say say", "How you remind me", "Tie a yellow ribbon round the ole oak tree", "It's all in the game", "I want to hold your hand", "Shadow dancing", "Call me maybe", "Blurred lines", "Candle in the wind ‘97/something about the way you look tonight", "No one", "I will always love you", "End of the road", "Boom boom pow", "Call me", "Let me love you", "Stayin’ alive", "Lady", "Tik tok", "I’m a believer", "Gold digger", "Apologize", "The sign", "Centerfold", "All about that bass", "(just like) starting over", "Royals", "The boy is mine", "Because i love you (the postman song)", "I love rock ’n rolln", "Aquarius/let the sunshine in", "Whoomp! (there it is)", "Moves like jagger", "Ebony and ivory", "Rush rush", "That’s what friends are for", "Happy", "Upside down", "Sugar, sugar", "Just the way you are", "Dilemma", "I heard it through the grapevine", "You’re still the one", "Billie jean", "Hot stuff", "Rockstar", "Gangsta’s paradise", "Abracadabra", "Perfect", "You’re so vain", "Play that funky music", "Say you, say me", "My sharona", "All night long (all night)", "Nothing compares 2 u", "I swear", "Family affair", "Waiting for a girl like you"];
/**
 * Generate a random song.
 *
 * @category Music
 *
 * @example
 *
 * randSong()
 *
 * @example
 *
 * randSong({ length: 10 })
 *
 */

function randSong(options) {
  return fake(data$3, options);
}
/**
 * Generate a random full address.
 *
 * @category Address
 *
 * @example
 *
 * randFullAddress()
 *
 * @example
 *
 * randFullAddress({ includeCounty: false }) // default is true
 *
 * @example
 *
 * randFullAddress({ includeCountry: false }) // default is true
 *
 * @example
 *
 * randFullAddress({ length: 10 })
 *
 */


function randFullAddress(options) {
  var _options$includeCount, _options$includeCount2;

  const includeCounty = (_options$includeCount = options == null ? void 0 : options.includeCounty) != null ? _options$includeCount : true;
  const includeCountry = (_options$includeCount2 = options == null ? void 0 : options.includeCountry) != null ? _options$includeCount2 : true;

  const factory = () => {
    const {
      street,
      city,
      county,
      country,
      zipCode
    } = randAddress({
      includeCounty,
      includeCountry
    });
    let address = `${street}, ${city}, `;

    if (includeCounty) {
      address += `${county}, `;
    }

    if (includeCountry) {
      address += `${country}, `;
    }

    return address + zipCode;
  };

  return fake(factory, options);
}

var data$2 = ["Aeroflot", "Air Canada", "Air Europa", "Air France", "Air New Zealand", "Alitalia", "American Airlines", "Avianca", "British Airways", "Cathay Pacific Airways", "Delta Air Lines", "EasyJet", "Emirates", "Etihad Airways", "Eurowings", "Finnair", "Garuda Indonesia", "Hainan Airlines", "Hawaiian Airlines", "Iberia", "Japan Airlines", "Jet2", "JetBlue", "KLM", "Korean Air", "Lufthansa", "Norwegian", "Qantas Airlines", "Qatar Airways", "RyanAir", "Singapore Airlines", "Swiss International Air Lines", "TAP Portugal", "Tarom", "Thai Airways", "Turkish Airlines", "United Airlines", "Virgin Atlantic", "Vueling Airlines", "Wizz Air"];
/**
 * Generate a random airline.
 *
 * @category flight
 *
 * @example
 *
 * randAirline()
 *
 * @example
 *
 * randAirline({ length: 10 })
 *
 */

function randAirline(options) {
  return fake(data$2, options);
}

const flightNumberInfo = {
  RyanAir: {
    prefix: 'FR'
  },
  'British Airways': {
    prefix: 'BA',
    suffixMin: 100,
    suffixMax: 999
  },
  Iberia: {
    prefix: 'IB'
  },
  Jet2: {
    prefix: 'LS'
  },
  EasyJet: {
    prefix: 'EZY',
    suffixMin: 100,
    suffixMax: 999
  },
  Emirates: {
    prefix: 'EK',
    suffixMin: 10,
    suffixMax: 99
  },
  'American Airlines': {
    prefix: 'AA'
  },
  JetBlue: {
    prefix: 'B',
    suffixMin: 100,
    suffixMax: 999
  },
  'Air Europa': {
    prefix: 'UX'
  },
  'Delta Air Lines': {
    prefix: 'DL'
  },
  'United Airlines': {
    prefix: 'UA'
  },
  'Virgin Atlantic': {
    prefix: 'VS'
  },
  'Thai Airways': {
    prefix: 'TG'
  },
  'Qatar Airways': {
    prefix: 'QR'
  }
};

function generateStandardFlightNumber({
  prefix,
  suffixMin = 1000,
  suffixMax = 9999
}) {
  return `${prefix}${getRandomInRange({
    min: suffixMin,
    max: suffixMax
  })}`;
}
/**
 * Generate a random flight number.
 *
 * @category flight
 *
 * @example
 *
 * randFlightNumber()
 *
 * @example
 *
 * randFlightNumber({ airline: 'RyanAir' })
 *
 * @example
 *
 * randFlightNumber({ length: 10 })
 *
 */


function randFlightNumber(options) {
  var _options$airline;

  const airline = (_options$airline = options == null ? void 0 : options.airline) != null ? _options$airline : rand(data$2);

  const factory = () => {
    if (flightNumberInfo[airline]) {
      return generateStandardFlightNumber(flightNumberInfo[airline]);
    }

    return getRandomInRange({
      min: 10000,
      max: 99999
    }).toString();
  };

  return fake(factory, options);
}
/**
 * Generate a random seat number.
 *
 * @category flight
 *
 * @example
 *
 * randSeatNumber()
 *
 * @example
 *
 * randSeatNumber({ length: 10 })
 *
 */


function randSeatNumber(options) {
  const factory = () => {
    return `${getRandomInRange({
      min: 1,
      max: 33
    })}${rand(['A', 'B', 'C', 'D', 'E', 'F'])}`;
  };

  return fake(factory, options);
}

var data$1 = [{
  name: "Hartsfield–Jackson Atlanta International Airport",
  code: "ATL",
  city: "Atlanta",
  country: "United States"
}, {
  name: "Los Angeles International Airport",
  code: "LAX",
  city: "Los Angeles",
  country: "United States"
}, {
  name: "O'Hare International Airport",
  code: "ORD",
  city: "Chicago",
  country: "United States"
}, {
  name: "Dallas-Fort Worth International Airport",
  code: "DFW",
  city: "Dallas",
  country: "United States"
}, {
  name: "Denver International Airport",
  code: "DEN",
  city: "Denver",
  country: "United States"
}, {
  name: "John F. Kennedy International Airport",
  code: "JFK",
  city: "New York",
  country: "United States"
}, {
  name: "San Francisco International Airport",
  code: "SFO",
  city: "San Francisco",
  country: "United States"
}, {
  name: "McCarran International Airport",
  code: "LAS",
  city: "Las Vegas",
  country: "United States"
}, {
  name: "Toronto Pearson International Airport",
  code: "YYZ",
  city: "Toronto",
  country: "Canada"
}, {
  name: "Seattle–Tacoma International Airport",
  code: "SEA",
  city: "Seattle",
  country: "United States"
}, {
  name: "Charlotte Douglas International Airport",
  code: "CLT",
  city: "Charlotte",
  country: "United States"
}, {
  name: "Orlando International Airport",
  code: "MCO",
  city: "Orlando",
  country: "United States"
}, {
  name: "Miami International Airport",
  code: "MIA",
  city: "Miami",
  country: "United States"
}, {
  name: "Phoenix Sky Harbor International Airport",
  code: "PHX",
  city: "Phoenix",
  country: "United States"
}, {
  name: "Newark Liberty International Airport",
  code: "EWR",
  city: "Newark",
  country: "United States"
}, {
  name: "George Bush Intercontinental Houston Airport",
  code: "IAH",
  city: "Houston",
  country: "United States"
}, {
  name: "Minneapolis-St Paul International/Wold-Chamberlain Airport",
  code: "MSP",
  city: "Minneapolis",
  country: "United States"
}, {
  name: "Logan International Airport",
  code: "BOS",
  city: "Boston",
  country: "United States"
}, {
  name: "Detroit Metropolitan Wayne County Airport",
  code: "DTW",
  city: "Detroit",
  country: "United States"
}, {
  name: "Fort Lauderdale Hollywood International Airport",
  code: "FLL",
  city: "Fort Lauderdale",
  country: "United States"
}, {
  name: "Orlando Executive Airport",
  code: "ORL",
  city: "Orlando",
  country: "United States"
}, {
  name: "LaGuardia Airport",
  code: "LGA",
  city: "New York",
  country: "United States"
}, {
  name: "Philadelphia International Airport",
  code: "PHL",
  city: "Philadelphia",
  country: "United States"
}, {
  name: "Baltimore/Washington International Thurgood Marshall Airport",
  code: "BWI",
  city: "Baltimore",
  country: "United States"
}, {
  name: "Salt Lake City International Airport",
  code: "SLC",
  city: "Salt Lake City",
  country: "United States"
}, {
  name: "Vancouver International Airport",
  code: "YVR",
  city: "Vancouver",
  country: "Canada"
}, {
  name: "Ronald Reagan Washington National Airport",
  code: "DCA",
  city: "Washington",
  country: "United States"
}, {
  name: "Washington Dulles International Airport",
  code: "IAD",
  city: "Washington",
  country: "United States"
}, {
  name: "Midway International Airport",
  code: "MDW",
  city: "Chicago",
  country: "United States"
}, {
  name: "San Diego International Airport",
  code: "SAN",
  city: "San Diego",
  country: "United States"
}, {
  name: "O. R. Tambo International Airport",
  code: "JNB",
  city: "Johannesburg",
  country: "South Africa"
}, {
  name: "Cairo International Airport",
  code: "CAI",
  city: "Cairo",
  country: "Egypt"
}, {
  name: "Cape Town International Airport",
  code: "CPT",
  city: "Cape Town",
  country: "South Africa"
}, {
  name: "Mohammed V International Airport",
  code: "CMN",
  city: "Casablanca",
  country: "Morocco"
}, {
  name: "Addis Ababa Bole International Airport",
  code: "ADD",
  city: "Addis Ababa",
  country: "Ethiopia"
}, {
  name: "Houari Boumediene Airport",
  code: "ALG",
  city: "Algier",
  country: "Algeria"
}, {
  name: "Jomo Kenyatta International Airport",
  code: "NBO",
  city: "Nairobi",
  country: "Kenya"
}, {
  name: "Murtala Muhammed International Airport",
  code: "LOS",
  city: "Lagos",
  country: "Nigeria"
}, {
  name: "Tunis Carthage International Airport",
  code: "TUN",
  city: "Tunis",
  country: "Tunisia"
}, {
  name: "King Shaka International Airport",
  code: "DUR",
  city: "Durban",
  country: "South Africa"
}, {
  name: "Menara Airport",
  code: "RAK",
  city: "Marrakech",
  country: "Morocco"
}, {
  name: "Hurghada International Airport",
  code: "HRG",
  city: "Hurghada",
  country: "Egypt"
}, {
  name: "Monastir Habib Bourguiba International Airport",
  code: "MIR",
  city: "Monastir",
  country: "Tunisia"
}, {
  name: "Sir Seewoosagur Ramgoolam International Airport",
  code: "MRU",
  city: "Plaisance",
  country: "Mauritius"
}, {
  name: "Nnamdi Azikiwe International Airport",
  code: "ABV",
  city: "Abuja",
  country: "Nigeria"
}, {
  name: "Kotoka International Airport",
  code: "ACC",
  city: "Accra",
  country: "Ghana"
}, {
  name: "Sharm El Sheikh International Airport",
  code: "SSH",
  city: "Sharm El Sheikh",
  country: "Egypt"
}, {
  name: "Julius Nyerere International Airport",
  code: "DAR",
  city: "Dar Es Salaam",
  country: "Tanzania"
}, {
  name: "Quatro de Fevereiro Airport",
  code: "LAD",
  city: "Luanda",
  country: "Angola"
}, {
  name: "Roland Garros Airport",
  code: "RUN",
  city: "St.-denis",
  country: "Reunion"
}, {
  name: "Khartoum International Airport",
  code: "KRT",
  city: "Khartoum",
  country: "Sudan"
}, {
  name: "Léopold Sédar Senghor International Airport",
  code: "DKR",
  city: "Dakar",
  country: "Senegal"
}, {
  name: "Félix-Houphouët-Boigny International Airport",
  code: "ABJ",
  city: "Abidjan",
  country: "Cote d'Ivoire"
}, {
  name: "Es Senia Airport",
  code: "ORN",
  city: "Oran",
  country: "Algeria"
}, {
  name: "Borg El Arab Airport",
  code: "HBE",
  city: "Alexandria",
  country: "Egypt"
}, {
  name: "Port Elizabeth International Airport",
  code: "PLZ",
  city: "Port Elizabeth",
  country: "South Africa"
}, {
  name: "Agadir–Al Massira Airport",
  code: "AGA",
  city: "Agadir",
  country: "Morocco"
}, {
  name: "Entebbe International Airport",
  code: "EBB",
  city: "Entebbe",
  country: "Uganda"
}, {
  name: "Douala International Airport",
  code: "DLA",
  city: "Douala",
  country: "Cameroon"
}, {
  name: "Djerba–Zarzis International Airport",
  code: "DJE",
  city: "Djerba",
  country: "Tunisia"
}, {
  name: "Beijing Capital International Airport",
  code: "PEK",
  city: "Beijing",
  country: "China"
}, {
  name: "Dubai International Airport",
  code: "DXB",
  city: "Dubai",
  country: "United Arab Emirates"
}, {
  name: "Haneda Airport",
  code: "HND",
  city: "Tokyo",
  country: "Japan"
}, {
  name: "Hong Kong International Airport",
  code: "HKG",
  city: "Hong Kong",
  country: "Hong Kong"
}, {
  name: "Shanghai Pudong International Airport",
  code: "PVG",
  city: "Shanghai",
  country: "China"
}, {
  name: "Guangzhou Baiyun International Airport",
  code: "CAN",
  city: "Guangzhou",
  country: "China"
}, {
  name: "Indira Gandhi International Airport",
  code: "DEL",
  city: "Delhi",
  country: "India"
}, {
  name: "Soekarno-Hatta International Airport",
  code: "CGK",
  city: "Jakarta",
  country: "Indonesia"
}, {
  name: "Singapore Changi Airport",
  code: "SIN",
  city: "Singapore",
  country: "Singapore"
}, {
  name: "Incheon International Airport",
  code: "ICN",
  city: "Seoul",
  country: "South Korea"
}, {
  name: "Suvarnabhumi Airport",
  code: "BKK",
  city: "Bangkok",
  country: "Thailand"
}, {
  name: "Kuala Lumpur International Airport",
  code: "KUL",
  city: "Kuala Lumpur",
  country: "Malaysia"
}, {
  name: "Chengdu Shuangliu International Airport",
  code: "CTU",
  city: "Chengdu",
  country: "China"
}, {
  name: "Chhatrapati Shivaji International Airport",
  code: "BOM",
  city: "Mumbai",
  country: "India"
}, {
  name: "Shenzhen Bao'an International Airport",
  code: "SZX",
  city: "Shenzhen",
  country: "China"
}, {
  name: "Taiwan Taoyuan International Airport",
  code: "TPE",
  city: "Taipei",
  country: "Taiwan"
}, {
  name: "Kunming Changshui International Airport",
  code: "KMG",
  city: "Kunming",
  country: "China"
}, {
  name: "Ninoy Aquino International Airport",
  code: "MNL",
  city: "Manila",
  country: "Philippines"
}, {
  name: "Shanghai Hongqiao International Airport",
  code: "SHA",
  city: "Shanghai",
  country: "China"
}, {
  name: "Xi'an Xianyang International Airport",
  code: "XIY",
  city: "Xi'an",
  country: "China"
}, {
  name: "Narita International Airport",
  code: "NRT",
  city: "Tokyo",
  country: "Japan"
}, {
  name: "Chongqing Jiangbei International Airport",
  code: "CKG",
  city: "Chongqing",
  country: "China"
}, {
  name: "Don Mueang International Airport",
  code: "DMK",
  city: "Bangkok",
  country: "Thailand"
}, {
  name: "Tan Son Nhat International Airport",
  code: "SGN",
  city: "Ho Chi Minh City",
  country: "Vietnam"
}, {
  name: "Hamad International Airport",
  code: "DOH",
  city: "Doha",
  country: "Qatar"
}, {
  name: "Hangzhou Xiaoshan International Airport",
  code: "HGH",
  city: "Hangzhou",
  country: "China"
}, {
  name: "King Abdulaziz International Airport",
  code: "JED",
  city: "Jeddah",
  country: "Saudi Arabia"
}, {
  name: "Jeju International Airport",
  code: "CJU",
  city: "Cheju",
  country: "South Korea"
}, {
  name: "Kansai International Airport",
  code: "KIX",
  city: "Osaka",
  country: "Japan"
}, {
  name: "Nanjing Lukou International Airport",
  code: "NKG",
  city: "Nanjing",
  country: "China"
}, {
  name: "Sydney Airport",
  code: "SYD",
  city: "Sydney",
  country: "Australia"
}, {
  name: "Melbourne Airport",
  code: "MEL",
  city: "Melbourne",
  country: "Australia"
}, {
  name: "Brisbane International Airport",
  code: "BNE",
  city: "Brisbane",
  country: "Australia"
}, {
  name: "Auckland International Airport",
  code: "AKL",
  city: "Auckland",
  country: "New Zealand"
}, {
  name: "Perth International Airport",
  code: "PER",
  city: "Perth",
  country: "Australia"
}, {
  name: "Adelaide International Airport",
  code: "ADL",
  city: "Adelaide",
  country: "Australia"
}, {
  name: "Christchurch International Airport",
  code: "CHC",
  city: "Christchurch",
  country: "New Zealand"
}, {
  name: "Gold Coast Airport",
  code: "OOL",
  city: "Coolangatta",
  country: "Australia"
}, {
  name: "Wellington International Airport",
  code: "WLG",
  city: "Wellington",
  country: "New Zealand"
}, {
  name: "Cairns International Airport",
  code: "CNS",
  city: "Cairns",
  country: "Australia"
}, {
  name: "Canberra International Airport",
  code: "CBR",
  city: "Canberra",
  country: "Australia"
}, {
  name: "Hobart International Airport",
  code: "HBA",
  city: "Hobart",
  country: "Australia"
}, {
  name: "Darwin International Airport",
  code: "DRW",
  city: "Darwin",
  country: "Australia"
}, {
  name: "Nadi International Airport",
  code: "NAN",
  city: "Nandi",
  country: "Fiji"
}, {
  name: "Queenstown International Airport",
  code: "ZQN",
  city: "Queenstown International",
  country: "New Zealand"
}, {
  name: "Townsville Airport",
  code: "TSV",
  city: "Townsville",
  country: "Australia"
}, {
  name: "Launceston Airport",
  code: "LST",
  city: "Launceston",
  country: "Australia"
}, {
  name: "Newcastle Airport",
  code: "NTL",
  city: "Newcastle",
  country: "Australia"
}, {
  name: "Nelson Airport",
  code: "NSN",
  city: "Nelson",
  country: "New Zealand"
}, {
  name: "Dunedin Airport",
  code: "DUD",
  city: "Dunedin",
  country: "New Zealand"
}, {
  name: "Mackay Airport",
  code: "MKY",
  city: "Mackay",
  country: "Australia"
}, {
  name: "Port Moresby Jacksons International Airport",
  code: "POM",
  city: "Port Moresby",
  country: "Papua New Guinea"
}, {
  name: "Sunshine Coast Airport",
  code: "MCY",
  city: "Maroochydore",
  country: "Australia"
}, {
  name: "Karratha Airport",
  code: "KTA",
  city: "Karratha",
  country: "Australia"
}, {
  name: "Hawke's Bay Airport",
  code: "NPE",
  city: "NAPIER",
  country: "New Zealand"
}, {
  name: "Rockhampton Airport",
  code: "ROK",
  city: "Rockhampton",
  country: "Australia"
}, {
  name: "Palmerston North Airport",
  code: "PMR",
  city: "Palmerston North",
  country: "New Zealand"
}, {
  name: "Alice Springs Airport",
  code: "ASP",
  city: "Alice Springs",
  country: "Australia"
}, {
  name: "Hamilton Island Airport",
  code: "HTI",
  city: "Hamilton Island",
  country: "Australia"
}, {
  name: "Port Hedland International Airport",
  code: "PHE",
  city: "Port Hedland",
  country: "Australia"
}, {
  name: "Heathrow Airport",
  code: "LHR",
  city: "London",
  country: "United Kingdom"
}, {
  name: "Charles de Gaulle International Airport",
  code: "CDG",
  city: "Paris",
  country: "France"
}, {
  name: "Amsterdam Airport Schiphol",
  code: "AMS",
  city: "Amsterdam",
  country: "Netherlands"
}, {
  name: "Frankfurt am Main International Airport",
  code: "FRA",
  city: "Frankfurt",
  country: "Germany"
}, {
  name: "Istanbul Atatürk Airport",
  code: "IST",
  city: "Istanbul",
  country: "Turkey"
}, {
  name: "Adolfo Suárez Madrid–Barajas Airport",
  code: "MAD",
  city: "Madrid",
  country: "Spain"
}, {
  name: "Barcelona–El Prat Airport",
  code: "BCN",
  city: "Barcelona",
  country: "Spain"
}, {
  name: "Gatwick Airport",
  code: "LGW",
  city: "London",
  country: "United Kingdom"
}, {
  name: "Munich Airport",
  code: "MUC",
  city: "Munich",
  country: "Germany"
}, {
  name: "Leonardo da Vinci–Fiumicino Airport",
  code: "FCO",
  city: "Rome",
  country: "Italy"
}, {
  name: "Sheremetyevo International Airport",
  code: "SVO",
  city: "Moscow",
  country: "Russia"
}, {
  name: "Sabiha Gökçen International Airport",
  code: "SAW",
  city: "Istanbul",
  country: "Turkey"
}, {
  name: "Moscow Domodedovo Airport",
  code: "DME",
  city: "Moscow",
  country: "Russia"
}, {
  name: "Dublin Airport",
  code: "DUB",
  city: "Dublin",
  country: "Ireland"
}, {
  name: "Zürich Airport",
  code: "ZRH",
  city: "Zurich",
  country: "Switzerland"
}, {
  name: "Copenhagen Airport",
  code: "CPH",
  city: "Copenhagen",
  country: "Denmark"
}, {
  name: "Palma De Mallorca Airport",
  code: "PMI",
  city: "Palma de Mallorca",
  country: "Spain"
}, {
  name: "Manchester Airport",
  code: "MAN",
  city: "Manchester",
  country: "United Kingdom"
}, {
  name: "Oslo Airport, Gardermoen",
  code: "OSL",
  city: "Oslo",
  country: "Norway"
}, {
  name: "Lisbon Portela Airport",
  code: "LIS",
  city: "Lisbon",
  country: "Portugal"
}, {
  name: "Stockholm Arlanda Airport",
  code: "ARN",
  city: "Stockholm",
  country: "Sweden"
}, {
  name: "Antalya Airport",
  code: "AYT",
  city: "Antalya",
  country: "Turkey"
}, {
  name: "London Stansted Airport",
  code: "STN",
  city: "London",
  country: "United Kingdom"
}, {
  name: "Brussels Airport",
  code: "BRU",
  city: "Brussels",
  country: "Belgium"
}, {
  name: "Düsseldorf International Airport",
  code: "DUS",
  city: "Duesseldorf",
  country: "Germany"
}, {
  name: "Vienna International Airport",
  code: "VIE",
  city: "Vienna",
  country: "Austria"
}, {
  name: "Milan–Malpensa Airport",
  code: "MXP",
  city: "Milano",
  country: "Italy"
}, {
  name: "Athens International Airport",
  code: "ATH",
  city: "Athens",
  country: "Greece"
}, {
  name: "Berlin-Tegel International Airport",
  code: "TXL",
  city: "Berlin",
  country: "Germany"
}, {
  name: "Helsinki Airport",
  code: "HEL",
  city: "Helsinki",
  country: "Finland"
}, {
  name: "Málaga Airport",
  code: "AGP",
  city: "Malaga",
  country: "Spain"
}, {
  name: "Mexico City International Airport",
  code: "MEX",
  city: "Mexico City",
  country: "Mexico"
}, {
  name: "São Paulo–Guarulhos International Airport",
  code: "GRU",
  city: "Sao Paulo",
  country: "Brazil"
}, {
  name: "El Dorado International Airport",
  code: "BOG",
  city: "Bogota",
  country: "Colombia"
}, {
  name: "Cancún International Airport",
  code: "CUN",
  city: "Cancun",
  country: "Mexico"
}, {
  name: "Comodoro Arturo Merino Benítez International Airport",
  code: "SCL",
  city: "Santiago",
  country: "Chile"
}, {
  name: "Jorge Chávez International Airport",
  code: "LIM",
  city: "Lima",
  country: "Peru"
}, {
  name: "São Paulo–Congonhas Airport",
  code: "CGH",
  city: "Sao Paulo",
  country: "Brazil"
}, {
  name: "Presidente Juscelino Kubistschek International Airport",
  code: "BSB",
  city: "Brasilia",
  country: "Brazil"
}, {
  name: "Rio de Janeiro–Galeão International Airport",
  code: "GIG",
  city: "Rio De Janeiro",
  country: "Brazil"
}, {
  name: "Tocumen International Airport",
  code: "PTY",
  city: "Panama City",
  country: "Panama"
}, {
  name: "Aeroparque Jorge Newbery",
  code: "AEP",
  city: "Buenos Aires",
  country: "Argentina"
}, {
  name: "Guadalajara International Airport",
  code: "GDL",
  city: "Guadalajara",
  country: "Mexico"
}, {
  name: "Ministro Pistarini International Airport",
  code: "EZE",
  city: "Buenos Aires",
  country: "Argentina"
}, {
  name: "Tancredo Neves International Airport",
  code: "CNF",
  city: "Belo Horizonte",
  country: "Brazil"
}, {
  name: "Monterrey International Airport",
  code: "MTY",
  city: "Monterrey",
  country: "Mexico"
}, {
  name: "Viracopos International Airport",
  code: "VCP",
  city: "Campinas",
  country: "Brazil"
}, {
  name: "Santos Dumont Airport",
  code: "SDU",
  city: "Rio De Janeiro",
  country: "Brazil"
}, {
  name: "Salgado Filho Airport",
  code: "POA",
  city: "Porto Alegre",
  country: "Brazil"
}, {
  name: "Guararapes - Gilberto Freyre International Airport",
  code: "REC",
  city: "Recife",
  country: "Brazil"
}, {
  name: "Deputado Luís Eduardo Magalhães International Airport",
  code: "SSA",
  city: "Salvador",
  country: "Brazil"
}, {
  name: "General Abelardo L. Rodríguez International Airport",
  code: "TIJ",
  city: "Tijuana",
  country: "Mexico"
}, {
  name: "Afonso Pena Airport",
  code: "CWB",
  city: "Curitiba",
  country: "Brazil"
}, {
  name: "Pinto Martins International Airport",
  code: "FOR",
  city: "Fortaleza",
  country: "Brazil"
}, {
  name: "José Martí International Airport",
  code: "HAV",
  city: "Havana",
  country: "Cuba"
}, {
  name: "Juan Santamaria International Airport",
  code: "SJO",
  city: "San Jose",
  country: "Costa Rica"
}, {
  name: "Maturín Airport",
  code: "MUN",
  city: "Maturin",
  country: "Venezuela"
}, {
  name: "Hercílio Luz International Airport",
  code: "FLN",
  city: "Florianopolis",
  country: "Brazil"
}, {
  name: "Val de Cans International Airport",
  code: "BEL",
  city: "Belem",
  country: "Brazil"
}, {
  name: "Alejandro Velasco Astete International Airport",
  code: "CUZ",
  city: "Cuzco",
  country: "Peru"
}, {
  name: "Santa Genoveva Airport",
  code: "GYN",
  city: "Goiania",
  country: "Brazil"
}];
/**
 * Generate a random airport.
 *
 * @category flight
 *
 * @example
 *
 * randAirport()
 *
 * @example
 *
 * randAirport({ length: 10 })
 *
 */

function randAirport(options) {
  return fake(data$1, options);
}

function generateFlightLength() {
  return Math.ceil(getRandomInRange({
    min: 1,
    max: 9,
    fraction: 2
  }) / 0.25) * 0.25;
}
/**
 * Generate a random flight details.
 *
 * @category flight, entities
 *
 * @example
 *
 * randFlightDetails()
 *
 * @example
 *
 * randFlightDetails({ passenger: 'Ryan Smee' })
 *
 * @example
 *
 * randFlightDetails({ airline: 'RyanAir' })
 *
 * @example
 *
 * randFlightDetails({ length: 10 })
 *
 */


function randFlightDetails(options) {
  const factory = () => {
    var _options$airline, _options$passenger;

    const airline = (_options$airline = options == null ? void 0 : options.airline) != null ? _options$airline : randAirline();
    const passenger = (_options$passenger = options == null ? void 0 : options.passenger) != null ? _options$passenger : randFullName();
    const [origin, destination] = randAirport({
      length: 2
    });
    return {
      passenger,
      airline,
      flightNumber: randFlightNumber({
        airline: airline
      }),
      origin,
      destination,
      date: randFutureDate().toISOString(),
      seat: randSeatNumber(),
      flightLength: generateFlightLength()
    };
  };

  return fake(factory, options);
}
/**
 * Generate a random credit card.
 *
 * @category finance, entities
 *
 * @example
 *
 * randCreditCard()
 *
 * @example
 *
 * randCreditCard({ fullName: 'Mr Ryan Smee' })
 *
 * @example
 *
 * randCreditCard({ brand: 'Visa' })
 *
 * @example
 *
 * randCreditCard({ length: 10 })
 *
 */


function randCreditCard(options) {
  const factory = () => {
    var _options$fullName, _options$brand;

    const fullName = (_options$fullName = options == null ? void 0 : options.fullName) != null ? _options$fullName : `${randPersonTitle()} ${randFullName({
      withAccents: false
    })}`;
    const brand = (_options$brand = options == null ? void 0 : options.brand) != null ? _options$brand : randCreditCardBrand();
    const dateOptions = {
      month: 'numeric',
      year: '2-digit'
    };
    const validFrom = randPastDate({
      years: 1
    }).toLocaleDateString('en-GB', dateOptions);
    const untilEnd = randFutureDate({
      years: 2
    }).toLocaleDateString('en-GB', dateOptions);
    return {
      fullName,
      brand,
      validFrom,
      untilEnd,
      ccv: randCreditCardCVV(),
      number: randCreditCardNumber({
        brand
      }),
      account: randAccount(),
      type: rand(['Credit', 'Debit'])
    };
  };

  return fake(factory, options);
}

const generateRandomValue = () => {
  const availableValuesGenerators = [randBoolean(), randNumber(), randNumber({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randSinger(), randSinger({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randMovie(), randMovie({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randMovieCharacter(), randMovieCharacter({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randWord(), randWord({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randSnake(), randSnake({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randUser(), randUser({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randAddress(), randAddress({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randProduct(), randProduct({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randFlightDetails(), randFlightDetails({
    length: randNumber({
      min: 1,
      max: 10
    })
  }), randCreditCard(), randCreditCard({
    length: randNumber({
      min: 1,
      max: 10
    })
  })];
  return availableValuesGenerators[randNumber({
    min: 0,
    max: availableValuesGenerators.length - 1
  })];
};
/**
 * Generate a random JSON Object.
 *
 * @category Datatype
 *
 * @example
 * randJSON()
 *
 * @example If a fixed number of keys are required
 *
 * randJSON({ totalKeys: 10 })
 *
 * @example If a random number of keys are required
 *
 * randJSON({ minKeys: 1, maxKeys: 10 })
 *
 */


function randJSON(options) {
  var _options$totalKeys;

  const objectSize = (_options$totalKeys = options == null ? void 0 : options.totalKeys) != null ? _options$totalKeys : randNumber({
    min: (options == null ? void 0 : options.minKeys) || 1,
    max: (options == null ? void 0 : options.maxKeys) || 99
  });

  const factory = () => {
    const generatedObject = {};

    for (let index = 0; index < objectSize; index++) {
      generatedObject[randUuid().replace(/-/g, '')] = generateRandomValue();
    }

    return generatedObject;
  };

  return fake(factory, options);
}

var data = {
  bash: "#!/bin/bash\n\nmove()\n{\n  local n=\"$1\"\n  local from=\"$2\"\n  local to=\"$3\"\n  local via=\"$4\"\n\n  if [[ \"$n\" == \"1\" ]]\n  then\n    echo \"Move disk from pole $from to pole $to\"\n  else\n    move $(($n - 1)) $from $via $to\n    move 1 $from $to $via\n    move $(($n - 1)) $via $to $from\n  fi\n}\n\nmove $1 $2 $3 $4",
  c: "#include <stdio.h>\n\nvoid move(int n, int from, int via, int to) {\n   if (n > 1) {\n      move(n - 1, from, to, via);\n      printf(\"Move disk from pole %d to pole %d\\n\", from, to);\n      move(n - 1, via, from, to);\n   } else {\n      printf(\"Move disk from pole %d to pole %d\\n\", from, to);\n   }\n}\nint main() {\n   move(4, 1, 2, 3);\n   return 0;\n}",
  "c#": "public void move(int n, int from, int to, int via) {\n  if (n == 1) {\n    System.Console.WriteLine(\"Move disk from pole \" + from + \" to pole \" + to);\n  } else {\n    move(n - 1, from, via, to);\n    move(1, from, to, via);\n    move(n - 1, via, to, from);\n  }\n}",
  "c++": "void move(int n, int from, int to, int via) {\n  if (n == 1) {\n    std::cout << \"Move disk from pole \" << from << \" to pole \" << to << std::endl;\n  } else {\n    move(n - 1, from, via, to);\n    move(1, from, to, via);\n    move(n - 1, via, to, from);\n  }\n}",
  css: ".hover-rotate {\n  overflow: hidden;\n  margin: 8px;\n  min-width: 240px;\n  max-width: 320px;\n  width: 100%;\n}\n\n.hover-rotate img {\n  transition: all 0.3s;\n  box-sizing: border-box;\n  max-width: 100%;\n}\n\n.hover-rotate:hover img {\n  transform: scale(1.3) rotate(5deg);\n}",
  go: "func fib(a int) int {\n  if a < 2 {\n      return a\n  }\n  return fib(a - 1) + fib(a - 2)\n}",
  html: "<form action=\"http://maps.google.com/maps\" method=\"get\" target=\"_blank\">\n  <label for=\"saddr\">Enter your location</label>\n  <input type=\"text\" name=\"saddr\" />\n  <input type=\"hidden\" name=\"daddr\" value=\"350 5th Ave New York, NY 10018 (Empire State Building)\" />\n  <input type=\"submit\" value=\"Get directions\" />\n</form>",
  java: "public void move(int n, int from, int to, int via) {\n  if (n == 1) {\n      System.out.println(\"Move disk from pole \" + from + \" to pole \" + to);\n  } else {\n      move(n - 1, from, via, to);\n      move(1, from, to, via);\n      move(n - 1, via, to, from);\n  }\n}",
  javascript: "function move(n, a, b, c) {\n  if (n > 0) {\n    move(n - 1, a, c, b);\n    console.log(\"Move disk from \" + a + \" to \" + c);\n    move(n - 1, b, a, c);\n  }\n}\nmove(4, \"A\", \"B\", \"C\");",
  php: "function move($n,$from,$to,$via) {\n  if ($n === 1) {\n    print(\"Move disk from pole $from to pole $to\");\n  } else {\n    move($n-1,$from,$via,$to);\n    move(1,$from,$to,$via);\n    move($n-1,$via,$to,$from);\n  }\n}",
  python: "def hanoi(ndisks, startPeg=1, endPeg=3):\n  if ndisks:\n    hanoi(ndisks - 1, startPeg, 6 - startPeg - endPeg)\n    print \"Move disk %d from peg %d to peg %d\" % (ndisks, startPeg, endPeg)\n    hanoi(ndisks - 1, 6 - startPeg - endPeg, endPeg)\n\nhanoi(ndisks=4)",
  rust: "fn move_(n: i32, from: i32, to: i32, via: i32) {\n  if n > 0 {\n      move_(n - 1, from, via, to);\n      println!(\"Move disk from pole {} to pole {}\", from, to);\n      move_(n - 1, via, to, from);\n  }\n}\n \nfn main() {\n  move_(4, 1,2,3);\n}",
  sql: "SELECT *\nFROM   call\nORDER  BY call.employee_id ASC,\n          call.start_time ASC;",
  swift: "func hanoi(n: Int, a: String, b: String, c: String) {\n  if n > 0 {\n    hanoi(n - 1, a: a, b: c, c: b)\n    print(\"Move disk from \\\\(a) to \\\\(c)\")\n    hanoi(n - 1, a: b, b: a, c: c)\n  }\n}\n  \nhanoi(4, a: \"A\", b: \"B\", c: \"C\")';"
};
/**
 * Generate a random code snippet.
 *
 * @category code
 *
 * @example
 *
 * randCodeSnippet()
 *
 * @example
 *
 * randCodeSnippet({ length: 10 })
 *
 * @example
 *
 * randCodeSnippet({ lang: 'html' }) // default is 'javascript'
 *
 */

function randCodeSnippet(options) {
  var _options$lang;

  const lang = (_options$lang = options == null ? void 0 : options.lang) != null ? _options$lang : 'javascript';
  return fake(() => data[lang], options);
}
/**
 * Generate a random text range.
 *
 * @category text
 *
 * @example
 *
 * randTextRange({ min: 10, max: 100 })
 *
 * @example
 *
 * randTextRange({ min: 10, max: 100, length: 10 })
 *
 */


function randTextRange(options) {
  const min = options.min;
  const max = options.max;

  if (min >= max) {
    throw new Error('Min must be less than max');
  }

  const factory = () => {
    const charCount = getRandomInRange({
      min,
      max
    });
    return randText({
      charCount
    });
  };

  return fake(factory, options);
}
/**
 * Generate a random airport name.
 *
 * @category flight
 *
 * @example
 *
 * randAirportName()
 *
 * @example
 *
 * randAirportName({ length: 10 })
 *
 */


function randAirportName(options) {
  const factory = () => {
    return rand(data$1.map(({
      name
    }) => name));
  };

  return fake(factory, options);
}
/**
 * Generate a random airport code.
 *
 * @category flight
 *
 * @example
 *
 * randAirportCode()
 *
 * @example
 *
 * randAirportCode({ length: 10 })
 *
 */


function randAirportCode(options) {
  const factory = () => {
    return rand(data$1.map(({
      code
    }) => code));
  };

  return fake(factory, options);
}

function isNotNil(value) {
  return value !== null || value !== undefined;
}
/**
 * Generate incremental numbers.
 *
 * @category factories
 *
 * @example
 *
 * const factory = incrementalNumber()
 * factory() // returns 1
 * factory() // returns 2
 *
 * @example
 *
 * const factory = incrementalNumber({from: 10, to: 100, step: 10})
 * factory() // returns 10
 * factory() // returns 20
 * ...
 *
 */


function incrementalNumber(options = {
  from: 1,
  step: 1
}) {
  if (options.step === 0) {
    throw new Error('`step` should be a number different than 0, for example: {from: 1, step: 1}');
  }

  if (options.from < 0) {
    throw new Error('`from` should be a number greater than 0');
  }

  if (isNotNil(options.to)) {
    if (options.to < 0) {
      throw new Error('`to` should be a number greater than from and greater than 0');
    }

    if (options.from > options.to && options.step > 0) {
      throw new Error('`to` should be higher or equal to `from`, for example: {from: 1, to: 3}');
    }

    if (options.from < options.to && options.step < 0) {
      throw new Error('`to` should be lower or equal to `from`, for example: {from: 5, to: 1, step: -1}');
    }
  }

  let currentValue = options.from;
  return () => {
    if (isNotNil(options.to)) {
      if (options.step > 0 && currentValue > options.to) return undefined;
      if (options.step < 0 && currentValue < options.to) return undefined;
    }

    const next = currentValue;
    currentValue = currentValue + options.step;
    return next;
  };
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
/**
 * Generate incremental numbers.
 *
 * @category factories
 *
 * @example
 *
 * const factory = incrementalDate()
 * // seeds factory with new Date()
 * factory() // returns seed
 * factory() // returns seed + 1 day
 *
 * @example
 *
 * const factory = incrementalDate({from: new Date(2022,1,1), to: new Date(2022,1,3), step: 10})
 * // seeds factory with `from` value
 * factory() // returns seed
 * factory() // returns seed + 10ms
 * ...
 *
 */

function incrementalDate(options = {
  from: new Date(),
  step: millisecondsPerDay
}) {
  const from = new Date(options.from);
  const to = options.to ? new Date(options.to) : undefined;

  if (options.step === 0) {
    throw new Error('`step` should be a number different from 0, for example: {from: new Date(), step: 10}');
  }

  if (isNotNil(to)) {
    if (from > to && options.step > 0) {
      throw new Error('`to` should be a date greater than or equal to `from`');
    }

    if (from < to && options.step < 0) {
      throw new Error('`to` should be a date lower than or equal to `from`');
    }
  }

  const numberFactory = incrementalNumber({
    from: from.getTime(),
    to: to == null ? void 0 : to.getTime(),
    step: options.step
  });
  return () => {
    const next = numberFactory();
    return next ? new Date(next) : undefined;
  };
}
},{"seedrandom":"node_modules/seedrandom/index.js","uuid":"node_modules/uuid/dist/esm-browser/index.js"}],"src/User.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0; //import faker from 'faker' ;

var falso_1 = require("@ngneat/falso");

var User =
/** @class */
function () {
  function User() {
    this.name = (0, falso_1.randFirstName)();
    this.location = {
      lat: (0, falso_1.randLatitude)(),
      lng: (0, falso_1.randLongitude)()
    };
  }

  User.prototype.markerContent = function () {
    return "User name: ".concat(this.name);
  };

  return User;
}();

exports.User = User;
},{"@ngneat/falso":"node_modules/@ngneat/falso/index.esm.js"}],"src/Company.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Company = void 0;

var falso_1 = require("@ngneat/falso");

var Company =
/** @class */
function () {
  function Company() {
    this.companyName = (0, falso_1.randCompanyName)();
    this.brand = (0, falso_1.randBrand)();
    this.location = {
      lat: (0, falso_1.randLatitude)(),
      lng: (0, falso_1.randLongitude)()
    };
  }

  Company.prototype.markerContent = function () {
    return "\n            <div>\n                <h1>Company name: ".concat(this.companyName, "</h1>\n                <h3>Brand: ").concat(this.brand, "</h3>\n            </div>\n        ");
  };

  return Company;
}();

exports.Company = Company;
},{"@ngneat/falso":"node_modules/@ngneat/falso/index.esm.js"}],"src/CustomMap.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomMap = void 0;

var CustomMap =
/** @class */
function () {
  function CustomMap(containerId) {
    this.gopgleMap = new google.maps.Map(document.getElementById(containerId), {
      zoom: 1,
      center: {
        lat: 0,
        lng: 0
      }
    });
  }

  CustomMap.prototype.addMarker = function (mappable) {
    var _this = this;

    var marker = new google.maps.Marker({
      map: this.gopgleMap,
      position: {
        lat: mappable.location.lat,
        lng: mappable.location.lng
      }
    });
    marker.addListener('click', function () {
      var infoWindow = new google.maps.InfoWindow({
        content: mappable.markerContent()
      });
      infoWindow.open(_this.gopgleMap, marker);
    });
  };

  return CustomMap;
}();

exports.CustomMap = CustomMap;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var User_1 = require("./User");

var Company_1 = require("./Company");

var CustomMap_1 = require("./CustomMap");

var user = new User_1.User();
var company = new Company_1.Company();
var cusotomMap = new CustomMap_1.CustomMap('map');
cusotomMap.addMarker(user);
cusotomMap.addMarker(company);
},{"./User":"src/User.ts","./Company":"src/Company.ts","./CustomMap":"src/CustomMap.ts"}],"../../../../.nvm/versions/node/v14.16.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63080" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../.nvm/versions/node/v14.16.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map