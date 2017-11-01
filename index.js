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
  'largin\/index\.js',
  '\/node_modules',
  'events\.js',
  'process\b',
  'next_tick\.js',
  'native',
  'internal',
  '_stream_readable\.js'
].join('|'), 'i');

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
        return path;
      })
      .filter(line => line)
      .pop();
  }
  return callStackCache[sh];
};

const flargin = spec => {
  const colorize = (arg, i) => {
    if (spec.noColor) return arg;
    let color = ['gray'][i % 1];
    if (i === 1) color = colors[spec.level];
    return chalk[color](arg);
  };
  return function() {
    const now = new Date().toISOString().replace(/T/,' ').replace(/Z$/,'');
    const caller = traceCaller(new Error().stack);
    const isError = spec.summarizeErrors && arguments.length === 1 &&
        arguments[0] instanceof Error;
    const message = isError ? `${arguments[0].name}: ${arguments[0].message}` :
      util.format(...arguments);
    process.stdout.write([
      colorize(spec.level.charAt(0).toUpperCase(), 1),
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
    Object.keys(colors).forEach(level => self[level] = flargin({
      noColor: opts.noColor,
      summarizeErrors: opts.summarizeErrors,
      level: level
    }));
    module.exports = self;
    return self;
  }
};
