'use strict'

const tape = require('tape')
const gk = require('./index')
const round = require('lodash.round')

const round2 = (x) => round(x, 2)
const round5 = (x) => round(x, 5)

tape('gauss-krueger', (t) => {
	t.plan(4)

	const input1 = {x: 4591270, y: 5819620}
	const output1 = gk.toWGS(input1)
	const reversed1 = gk.toGK(output1)
	t.ok(round2(input1.x) === round2(reversed1.x))
	t.ok(round2(input1.y) === round2(reversed1.y))

	const input2 = {longitude: 13.4, latitude: 52.5}
	const output2 = gk.toGK(input2)
	const reversed2 = gk.toWGS(output2)
	t.ok(round5(input2.longitude) === round5(reversed2.longitude))
	t.ok(round5(input2.latitude) === round5(reversed2.latitude))
})
