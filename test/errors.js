'use strict';
const log = require('../index.js').instance({expandErrors: true});

describe('Error Formatting', () => {
  it('should expand Error', () => {
    const logger = log.instance({expandErrors: true});
    logger.error(new Error('Testing'));
  });

  it('should not expand Error', () => {
    const logger = log.instance({expandErrors: false});
    logger.error(new Error('Testing'));
  });
});
