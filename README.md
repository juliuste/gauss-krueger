# gauss-krueger
[![npm version](https://img.shields.io/npm/v/gauss-krueger.svg)](https://www.npmjs.com/package/gauss-krueger) [![Build Status](https://travis-ci.org/juliuste/gauss-krueger.svg?branch=master)](https://travis-ci.org/juliuste/gauss-krueger) [![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

JavaScript module for converting GK4-coordinates into WGS84 latitide and longitude, and vice versa.

## Usage

```javascript
const gk = require('gauss-krueger')

let wgs84 = gk.gk2wgs({'x': 4591270, 'y': 5819620}) // {'lat': 52.502133988116455, 'lon': 13.342517405215336}
let gk4 = gk.wgs2gk({'lat': 52.502133988116455, 'lon': 13.342517405215336}) // {'x': 4591270, 'y': 5819620}
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/gauss-krueger/issues).
