'use strict';
let log = require('../index.js').instance();

describe('Severities', () => {
  it('should log every severity', () => Object.keys(log).forEach((sev) =>
    log[sev](`Testing ${Math.random().toString()}`)));

  it('should log every severity', () => {
    log = log.instance({
      noTimestamps: true,
      expandObjects: true,
      severity: 'verbose'
    });
    Object.keys(log).forEach((sev) =>
      log[sev](`Testing`, {val: Math.random().toString()}));
  });

  it('should log to set severity', () => {
    log = log.instance({
      noTimestamps: true,
      severity: 'info'
    });
    Object.keys(log).forEach((sev) =>
      log[sev](`Testing ${Math.random().toString()}`));
  });
});
