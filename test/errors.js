'use strict';
const Largin = require('../index.js');

describe('Error Formatting', () => {
  it('should expand Error', () => {
    const logger = Largin.newInstance({expandErrors: true});
    logger.error(new Error('Testing'));
  });

  it('should not expand Error', () => {
    const logger = Largin.newInstance({expandErrors: false});
    logger.error(new Error('Testing'));
  });
});
