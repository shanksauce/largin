/*eslint no-invalid-this: "off"*/
'use strict';
const crypto = require('crypto');
const log = require('../index.js').instance({
  noTimestamps: true,
  noColor: true,
  expandErrors: false
});

describe('Padding', () => {
  /**/
  it('should pad message', function() {
    this.timeout(0);

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

    setTimeout(() => log.info(new Error(makeStr())), 500);
  });
  /***/
});
