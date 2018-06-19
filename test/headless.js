global.window = global;
global.assert = require('chai').assert;
require('../src/social');
require('./social.spec.js');