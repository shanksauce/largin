'use strict';
const Largin = require('../index.js');

describe('Error Formatting', () => {
  it('should expand Error', () => {
    const logger = Largin.instance({summarizeErrors: false});
    logger.error(new Error('Testing'));
  });
});
