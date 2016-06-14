#!/usr/bin/env node
'use strict'

const assert = require('assert')
const gk = require('./index.js')

assert.deepEqual(gk.gk2wgs({'x': 4591270, 'y': 5819620}), {'lat': 52.502133988116455, 'lon': 13.342517405215336})

assert.deepEqual(gk.wgs2gk({'lat': 52.502133988116455, 'lon': 13.342517405215336}), {'x': 4591270, 'y': 5819620})