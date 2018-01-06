# gauss-krueger

JavaScript module for converting [*Gauß-Krüger*-coordinates](https://en.wikipedia.org/wiki/Gauss%E2%80%93Kr%C3%BCger_coordinate_system) into WGS84 latitide and longitude, and vice versa. Supported zones: **GK2** *(EPSG:31466)*, **GK3** *(EPSG:31467)*, **GK4** *(EPSG:31468)*, **GK5** *(EPSG:31469)*, based on the the **Bessel** ellipsoide and **Potsdam / Rauenberg** datum.

[![npm version](https://img.shields.io/npm/v/gauss-krueger.svg)](https://www.npmjs.com/package/gauss-krueger)
[![Build Status](https://travis-ci.org/juliuste/gauss-krueger.svg?branch=master)](https://travis-ci.org/juliuste/gauss-krueger)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/gauss-krueger.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/gauss-krueger.svg)](https://david-dm.org/juliuste/gauss-krueger)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/gauss-krueger.svg)](https://david-dm.org/juliuste/gauss-krueger#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/gauss-krueger.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Usage

```javascript
const gk = require('gauss-krueger')

let wgs84 = gk.toWGS({x: 4591270, y: 5819620}) // {longitude: 13.34255019849783, latitude: 52.50210050984162}

let gk = gk.toGK({longitude: 13.4, latitude: 52.5}) // {x: 4595175.488530577, y: 5819460.402152777}

// The script guesses the GK zone based on the input coordinate longitude.
// You can also supply a zone directly via the zone parameter:
let gk5 = gk.toGK({longitude: 13.4, latitude: 52.5}, 5) // {x: 5391482.283752493, y: 5819737.58836849}
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/gauss-krueger/issues).
