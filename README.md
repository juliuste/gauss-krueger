# gauss-krueger
[![Build Status](https://travis-ci.org/juliuste/gauss-krueger.svg?branch=master)](https://travis-ci.org/juliuste/gauss-krueger)[![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

*gauss-krueger* JavaScript module for converting GK4-coordinates into WGS84 latitide and longitude.

## Usage

```javascript
const gk = require('gauss-krueger')
let wgs84 = gk.gk2wgs(4591270, 5819620) // [52.502133988116455, 13.342517405215336]
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/gauss-krueger/issues).
