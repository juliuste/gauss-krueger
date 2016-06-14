const assert = require('assert')
const gk = require('./index.js')

assert.deepEqual(gk.gk2wgs(4591270, 5819620), [52.502133988116455, 13.342517405215336])