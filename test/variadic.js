'use strict';
const Largin = require('../index.js');
let log = Largin.newInstance({
  noTimestamps: true,
  expandErrors: false
});

describe('Variadic arguments', function() {
  it('should log strings', async function() {
    log.info('One', 'Two', 'Three');
  });

  it('should log multiple types', async function() {
    log.info('One', 2, {three: 3});
  });

  it('should log multiple types', async function() {
    log.info('One', 2, {three: 3}, new Error('Error message'));
  });

  it('should log multiple types', async function() {
    log = Largin.newInstance({
      noTimestamps: true,
      expandErrors: true
    });
    log.warn('One', new Error('Error message'), 2, {three: 3});
  });
});
