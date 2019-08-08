/*eslint no-invalid-this: "off"*/
'use strict';
const crypto = require('crypto');
const Largin = require('../index.js');

describe('Padding', () => {
  /**/
  it('should pad message', function() {
    this.timeout(0);

    const logger = Largin.newInstance({
      noTimestamps: true,
      noColor: true,
      expandErrors: false
    });

    const makeStr = () => crypto
      .randomBytes(Math.ceil(Math.random() * 20))
      .toString('base64');

    setInterval(() => logger.warn(makeStr()), 100);

    setInterval(() => logger.info({
      value: makeStr(),
      value1: makeStr(),
      value2: makeStr(),
      value3: makeStr(),
      value4: makeStr(),
      value5: makeStr(),
      value6: makeStr(),
      value7: makeStr()
    }), 200);

    setTimeout(() => logger.info(new Error(makeStr())), 500);
  });
  /***/
});
