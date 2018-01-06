/*eslint no-invalid-this: "off"*/
'use strict';
const Largin = require('../index.js');

describe('Padding', () => {
  /**/
  it('should pad message', function(done) {
    this.timeout(0);
    const logger = Largin.instance();
    setInterval(() => logger.warn('1'), 100);
    setInterval(() => logger.info('2'), 200);
    setTimeout(() => logger.info('3'), 500);
    setTimeout(() => {
      logger.info('done');
      done();
    }, 1000);
  });
  /***/
});
