'use strict';
const Largin = require('../index.js');
const logger = Largin.instance();

describe('Severities', () => {
  it('should log every severity', () => Object.keys(logger).forEach(sev =>
    logger[sev](`Testing ${Math.random().toString()}`)));
});
