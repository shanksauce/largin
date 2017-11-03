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

const callStackCache = Object.create(null);
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

const padlr = (str, padding = 0) => {
  padding += 1;
  const whitespace = [...(function*() {
    while ((--padding)) yield ' ';
  }())];
  return `${whitespace}${str}${whitespace}`;
};

const traceCaller = callStack => {
  const sh = murmur3(Buffer.from(callStack)).readUInt32BE();
  if (!(sh in callStackCache)) {
    if (!Array.isArray(callStack)) callStack = callStack.split('\n');
    callStackCache[sh] = callStack
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
        return `${padlr(path, Math.ceil((padding - path.length) / 2))}`;
      })
      .filter(line => line)
      .pop();
  }
  return callStackCache[sh];
};

const flargin = spec => {
  const {noColor, summarizeErrors, severity} = spec;
  const colorize = (arg, i) => {
    if (noColor) return arg;
    let color = ['gray'][i % 1];
    if (i === 1) color = colors[severity];
    return chalk[color](arg);
  };
  return function() {
    const now = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '');
    const caller = traceCaller(new Error().stack);
    const isError = summarizeErrors && arguments.length === 1 &&
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
      summarizeErrors: true
    };
    if ('info' in self) return self;
    self = {};
    Object.keys(colors).forEach(severity => self[severity] = flargin({
      noColor: opts.noColor,
      summarizeErrors: opts.summarizeErrors,
      severity: severity
    }));
    module.exports = self;
    return self;
  }
};
