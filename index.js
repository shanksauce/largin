'use strict';
const util = require('util');
const chalk = require('chalk');
const { murmur3 } = require('./lib/murmur3.node');

let instance = {};

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

let padding = 0;

const genWhitespace = function*(padding) {
  while ((--padding)) yield ' ';
};

const padr = (str, padding = 0) => {
  if (padding === 0) return str;
  padding += 1;
  const whitespace = [...genWhitespace(padding)].join('');
  return `${str}${whitespace}`;
};

const traceCaller = (callStack) => {
  const sh = murmur3(Buffer.from(callStack)).readUInt32BE();
  if (!(sh in callStackCache)) {
    callStackCache.set(sh, callStack
      .split('\n')
      .filter((x) => !rSkip.test(x))
      .map((line) => {
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
      .filter((line) => Boolean(line))
      .pop());
  }
  const message = callStackCache.get(sh) || '';
  return padr(message, padding - message.length);
};

const flargin = (opts) => {
  const { noColor, noTimestamps, expandErrors, severity } = opts;
  const colorize = (arg, i) => {
    if (noColor) return arg;
    let color = ['gray'][i % 1];
    if (i === 1) color = colors[severity];
    return chalk[color](arg);
  };
  const log = function() {
    const args = Array.from(arguments)
      .map((it) => (it instanceof Error && !expandErrors ?
        `${it.name}: ${it.message}` :
        it))
      .map((it) => (it instanceof Object && !(it instanceof Error) ?
        JSON.stringify(it) :
        it));
    const now = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '');
    const caller = traceCaller(new Error().stack);
    const message = util.format(...args);
    const line = [
      colorize(severity.charAt(0).toUpperCase(), 1),
      !noTimestamps ? colorize(now, 0) : null,
      colorize(caller, 1),
      message,
      log.newLine
    ].filter((it) => !!it).join('  ');
    process.stdout.write(line);
  };
  log.newLine = '\n';
  return log;
};

class Largin {
  static newInstance(opts) {
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

module.exports = Largin;
