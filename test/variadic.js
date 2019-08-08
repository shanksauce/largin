'use strict';
const Largin = require('../index.js');
let log = Largin.instance({
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

  it('should log multiple types with error expansion', async function() {
    log = Largin.instance({
      noTimestamps: true,
      expandErrors: true
    });
    log.warn('One', new Error('Error message'), 2, {three: 3});
  });

  it('should log multiple types', async function() {
    log = Largin.instance({
      noTimestamps: true,
      expandErrors: false
    });
    log.warn('One', new Error('Error message'), 2, {three: 3});
  });
});
