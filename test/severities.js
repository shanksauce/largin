'use strict';
let log = require('../index.js').instance();

describe('Severities', () => {
  it('should log every severity', () => Object.keys(log).forEach((sev) =>
    log[sev](`Testing ${Math.random().toString()}`)));

  it('should log every severity', () => {
    log = log.instance({noTimestamps: true});
    Object.keys(log).forEach((sev) =>
      log[sev](`Testing ${Math.random().toString()}`));
  });

});
