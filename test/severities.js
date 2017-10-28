'use strict';
const Largin = require('../index.js');
const logger = Largin.instance();

describe('Severities', () => {
  it('should log at INFO level', () => Object.keys(logger).forEach(severity => {
    logger[severity]('Testing ' + Math.random().toString());
  }));
});
