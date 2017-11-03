'use strict';
const util = require('util');
const chalk = require('chalk');
const {murmur3} = require('./lib/murmur3.node');

let padding = 1;
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

const padr = (str, padding = 0) => {
  if (padding === 0) return str;
  padding += 1;
  const whitespace = [...(function*() {
    while ((--padding)) yield ' ';
  }())].join('');
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
      .filter(line => line)
      .pop());
  }
  const message = callStackCache.get(sh);
  return `${padr(message, padding - message.length)}`;
};

const flargin = spec => {
  const {noColor, expandErrors, severity} = spec;
  const colorize = (arg, i) => {
    if (noColor) return arg;
    let color = ['gray'][i % 1];
    if (i === 1) color = colors[severity];
    return chalk[color](arg);
  };
  return function() {
    const now = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '');
    const caller = traceCaller(new Error().stack);
    const isError = !expandErrors && arguments.length === 1 &&
      arguments[0] instanceof Error;
    const message = isError ? `${arguments[0].name}: ${arguments[0].message}` :
      util.format(...arguments);
    process.stdout.write([
      colorize(severity.charAt(0).toUpperCase(), 1),
      colorize(now, 0),
      colorize(caller, 1),
      message,
      '\n'
    ].join('  '));
  };
};

module.exports = class Largin {
  static instance(opts) {
    opts = opts || {
      noColor: false,
      expandErrors: false
    };
    if ('info' in self) return self;
    self = {};
    Object.keys(colors).forEach(severity => self[severity] = flargin({
      noColor: opts.noColor,
      expandErrors: opts.expandErrors,
      severity: severity
    }));
    module.exports = self;
    return self;
  }
};
