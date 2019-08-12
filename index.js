'use strict';
const util = require('util');
const chalk = require('chalk');
const { murmur3 } = require('./lib/murmur3.node');

let instance;

const colors = {
  silly: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red'
};

const callStackCache = new Map();
const rSkip = new RegExp([
  '_stream_readable\.js',
  'events\.js',
  'internal',
  'largin\/index\.js',
  'native',
  'next_tick\.js',
  'process\b'
].join('|'), 'i');

const traceCaller = (callStack) => {
  const sh = murmur3(Buffer.from(callStack)).readUInt32BE();
  if (!(sh in callStackCache)) {
    const filtered = callStack
      .split('\n')
      .filter((x) => !rSkip.test(x))
      .map((line) => {
        const lineNumberAndColumn = line.split(':');
        const lineNumber = lineNumberAndColumn[1];
        const filenamePieces = lineNumberAndColumn[0]
          .replace(/^.*?(?=\/)/, '')
          .replace(/\/[0-9]+\./, '/')
          .split(/\//i);
        const filename = filenamePieces.pop();
        const subDirectory = filenamePieces.pop();
        if (!subDirectory) return null;
        return `${subDirectory}/${filename}:${lineNumber}`;
      })
      .filter((line) => Boolean(line));
    callStackCache.set(sh, filtered.shift());
  }
  return callStackCache.get(sh) || '';
};

const flargin = (opts) => {
  const { noColor, noTimestamps, expandErrors, severity } = opts;
  const colorize = (it) => !noColor ? chalk[colors[severity]](it) : it;
  return function() {
    const args = Array.from(arguments)
      .map((it) => it instanceof Error ?
        !expandErrors ?
          `${it.name}: ${it.message}` :
          `${it.stack}\n` :
        it)
      .map((it) => (it instanceof Object && !(it instanceof Error) ?
        JSON.stringify(it) :
        it));
    const now = new Date().toISOString();
    const caller = traceCaller(new Error().stack);
    const message = util.format(...args);
    const line = [
      colorize(severity.charAt(0).toUpperCase()),
      !noTimestamps ?
        !noColor ?
          chalk.gray(now) :
          now :
        null,
      colorize(caller),
      message,
      '\n'
    ]
      .filter((it) => Boolean(it))
      .join('  ');
    process.stdout.write(line);
  };
};

class Largin {
  instance(opts) {
    instance = null;
    return Largin.instance(opts);
  }

  static instance(opts) {
    opts = opts || {
      noColor: false,
      noTimestamps: false,
      expandErrors: false
    };
    if (instance instanceof Largin) return instance;
    instance = new Largin();
    Object.keys(colors).forEach((severity) => {
      opts.severity = severity;
      instance[severity] = flargin(opts);
    });
    module.exports = instance;
    return instance;
  }
}

module.exports = Largin.instance();
