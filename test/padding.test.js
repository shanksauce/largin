'use strict';
const crypto = require('crypto');
let log = require('../index.js').instance({
  noTimestamps: false,
  noColor: false,
  expandErrors: false
});

describe('Padding', () => {
  /**/
  it('should pad message', function() {
    setInterval(() => {
      log = require('../index.js').instance({
        noTimestamps: Math.random() < 0.5,
        noColor: Math.random() < 0.5,
        expandErrors: Math.random() < 0.5,
        expandObjects: Math.random() < 0.5
      });
    }, 2000);


    const makeStr = () => crypto
      .randomBytes(Math.ceil(Math.random() * 20))
      .toString('base64');

    setInterval(() => log.warn(makeStr()), 100);

    setInterval(() => log.info({
      value: makeStr(),
      value1: makeStr(),
      value2: makeStr(),
      value3: makeStr(),
      value4: makeStr(),
      value5: makeStr(),
      value6: makeStr(),
      value7: makeStr()
    }), 200);

    setInterval(() => log.error(new Error(makeStr())), 500);
  });
  /***/
});
