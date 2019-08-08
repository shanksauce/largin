#!/usr/bin/env node

const fs = require('fs');
const packageJson = require('../package.json');
let [major, minor, build] = packageJson.version.split('.');
packageJson.version = `${major}.${minor}.${Number(build) + 1}`;

console.log(packageJson);

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
