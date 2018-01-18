'use strict';
const util = require('util');
const chalk = require('chalk');
const {murmur3} = require('./lib/murmur3.node');

let self = {};

const colors = {
  silly: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red'
};

const callStackCache = new Map();
const rSplit = /\//i;
const rSkip = new RegExp([
  '_stream_readable\.js',
  '\/node_modules',
  'events\.js',
  'internal',
  'largin\/index\.js',
  'native',
  'next_tick\.js',
  'process\b'
].join('|'), 'i');

let padding = 1;

const genWhitespace = function*(padding) {
  while ((--padding)) yield ' ';
};

const padr = (str, padding = 0) => {
  if (padding === 0) return str;
  padding += 1;
  const whitespace = [...genWhitespace(padding)].join('');
  return `${str}${whitespace}`;
};

const traceCaller = callStack => {
  const sh = murmur3(Buffer.from(callStack)).readUInt32BE();
  if (!(sh in callStackCache)) {
    callStackCache.set(sh, callStack
      .split('\n')
      .filter(x => !rSkip.test(x))
      .map(line => {
        const lineNumberAndColumn = line.split(':');
        const lineNumber = lineNumberAndColumn[1];
        const filenamePieces = lineNumberAndColumn[0]
          .replace(/^.*?(?=\/)/, '')
          .replace(/\/[0-9]+\./, '/')
          .split(rSplit);
        const filename = filenamePieces.pop();
        const subDirectory = filenamePieces.pop();
        if (!subDirectory) return null;
        const path = `${subDirectory}/${filename}:${lineNumber}`;
        padding = Math.max(padding, path.length);
        return path;
      })
      .filter(line => Boolean(line))
      .pop());
  }
  const message = callStackCache.get(sh) || '';
  return padr(message, padding - message.length);
};

const flargin = opts => {
  const {noColor, noTimestamps, expandErrors, severity} = opts;
  const colorize = (arg, i) => {
    if (noColor) return arg;
    let color = ['gray'][i % 1];
    if (i === 1) color = colors[severity];
    return chalk[color](arg);
  };
  const log = function() {
    const now = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '');
    const caller = traceCaller(new Error().stack);
    const arg0 = arguments[0];
    const message = (arg0 instanceof Error && !expandErrors) ?
      arg0.name + ': ' + arg0.message :
      util.format(...arguments);
    const line = [
      colorize(severity.charAt(0).toUpperCase(), 1),
      !noTimestamps ? colorize(now, 0) : null,
      colorize(caller, 1),
      message,
      log.newLine
    ].filter(it => it).join('  ');
    process.stdout.write(line);
  };
  log.newLine = '\n';
  return log;
};

class Largin {
  static instance(opts) {
    opts = opts || {
      noColor: false,
      noTimestamps: false,
      expandErrors: false
    };
    if (self instanceof Largin) return self;
    self = new Largin();
    Object.keys(colors).forEach(severity => {
      opts.severity = severity;
      Object.defineProperty(self, severity, {
        value: flargin(opts),
        enumerable: true
      });
    });
    module.exports = self;
    return self;
  }
}

module.exports = Largin;
